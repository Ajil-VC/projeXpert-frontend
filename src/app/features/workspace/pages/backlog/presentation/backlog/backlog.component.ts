import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BacklogHeaderComponent } from "../backlog-header/backlog-header.component";
import { EpicsComponent } from "../epics/epics.component";
import { SprintComponent } from '../sprint/sprint.component';
import { CreateBacklogComponent } from "../create-backlog/create-backlog.component";
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { BacklogService } from '../../data/backlog.service';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';
import { LoaderService } from '../../../../../../core/data/loader.service';
import { distinctUntilChanged, forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../../../core/data/notification.service';
import { LoaderComponent } from '../../../../../../core/presentation/loader/loader.component';
import { PermissionsService } from '../../../../../../shared/utils/permissions.service';


@Component({
  selector: 'app-backlog',
  imports: [CommonModule, EpicsComponent, SprintComponent, CreateBacklogComponent, LoaderComponent],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent {


  title = 'scrum-board';
  isProjectSelected: boolean = true;
  epics!: Task[];
  backlogs!: Task[];
  sprints: Sprint[] = [];
  sprintIds: string[] = [];
  isLoading = false;


  private destroy$ = new Subject<void>();

  constructor(
    private shared: SharedService,
    private backlogSer: BacklogService,
    private cdRef: ChangeDetectorRef,
    private loader: LoaderService,
    private toast: NotificationService,
    private permission: PermissionsService
  ) {

  }

  trackBySprintId(index: number, sprint: Sprint) {
    return sprint._id;
  }


  handleDrop(item: Task) {

    const index = this.backlogs.findIndex(b => b._id === item._id);
    if (index > -1) this.backlogs.splice(index, 1);

  }

  refreshBacklogView() {
    this.loader.show();

    forkJoin({
      tasksRes: this.shared.getTasksInProject(),
      sprintsRes: this.backlogSer.getSprints()
    }).subscribe({
      next: ({ tasksRes, sprintsRes }) => {
        if (tasksRes.status) {
          const result = tasksRes.result;
          this.epics = result.filter((issue: Task) => issue.type === 'epic');
          this.backlogs = [...(result.filter((issue: Task) => issue.sprintId == null && issue.type !== 'epic') || [])];

        }


        if (sprintsRes.status) {

          this.sprints = sprintsRes.result;
          this.sprintIds = this.sprints.map(sprint => sprint._id as string);
        }

        this.loader.hide();
      },
      error: (err) => {

        this.loader.hide();
        this.toast.showError('Failed to refresh backlog data');
      }
    });

  }

  ngOnInit() {


    this.backlogSer.addIssue$.subscribe({
      next: (res: Task) => {
        if (res.sprintId) {

          const index = this.sprints.findIndex(s => s._id === res.sprintId);
          if (index !== -1) {
            const updatedSprint = {
              ...this.sprints[index],
              tasks: [
                ...((this.sprints[index].tasks || []) as Task[]),
                res
              ]
            };

            this.sprints = [
              ...this.sprints.slice(0, index),
              updatedSprint,
              ...this.sprints.slice(index + 1)
            ];
          }

        }

      }
    });

    this.shared.currentPro$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {

        if (!res) {
          this.isProjectSelected = false;
        } else {
          this.isProjectSelected = true;
        }
        this.refreshBacklogView();
      }
    })

    this.refreshBacklogView();

    this.shared.reload$.subscribe({
      next: (res) => {
        if (res) {
          this.epics = [];
          this.backlogs = [];
          this.sprints = [];
          if (this.permission.has(['view_sprint'])) {
            this.refreshBacklogView();
          }
        }
      }
    })

  }

  onSprintCreated(sprint: Sprint) {

    this.sprints = [...this.sprints, sprint];;
    this.sprintIds = [...this.sprintIds, sprint._id as string];
    this.cdRef.detectChanges();
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
