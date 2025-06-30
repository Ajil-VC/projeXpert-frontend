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


@Component({
  selector: 'app-backlog',
  imports: [CommonModule, BacklogHeaderComponent, EpicsComponent, SprintComponent, CreateBacklogComponent],
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

  constructor(private shared: SharedService, private backlogSer: BacklogService, private cdRef: ChangeDetectorRef, private loader: LoaderService) {

  }

  trackBySprintId(index: number, sprint: Sprint) {
    return sprint._id;
  }


  handleDrop(item: Task) {

    const index = this.backlogs.findIndex(b => b._id === item._id);
    if (index > -1) this.backlogs.splice(index, 1);

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

    this.shared.currentPro$.subscribe({
      next: (res) => {
        if (!res) {
          this.isProjectSelected = false;
        } else {
          this.isProjectSelected = true;
        }
      }
    })


    //tasks on init
    this.shared.getTasksInProject().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {

        this.epics = res.result.filter(issue => issue.type === 'epic');
        this.backlogs = res.result.filter(issue => (issue.sprintId == null && issue.type !== 'epic'));

      }
    })

    //Getting tasks on project change from header
    this.shared.taskSub$.subscribe({
      next: (res) => {
        const tasks = res as Task[];

        this.epics = tasks.filter(issue => issue.type === 'epic');
        this.backlogs = tasks.filter(issue => issue.sprintId == null && issue.type !== 'epic');

      }
    });


    //Here im initiating sprints to load the backlog page
    this.backlogSer.getSprints().subscribe({
      next: (res: { status: boolean, result: Sprint[] }) => {
        
        if (!res.status) {
          return;
        }
        this.sprints = res.result;
        this.sprintIds = this.sprints.map(sprint => sprint._id as string);
      }
    });
    //Here Im retrieving the sprint array on project change
    this.backlogSer.sprint$.subscribe({
      next: (res: Sprint[]) => {
        console.log(res, 'Sprint init')
        this.sprints = res;
        this.sprintIds = this.sprints.map(sprint => sprint._id as string);
        this.cdRef.detectChanges();
      }
    });
    //Here Im adding sprint into the backlog on adding sprint 
    // this.backlogSer.addSprint$.subscribe({
    //   next: (res: Sprint) => {

    //     this.sprints = [...this.sprints, res];;
    //     this.sprintIds = [...this.sprintIds, res._id as string];
    //     this.cdRef.detectChanges();
    //   }

    // });

  }

  onSprintCreated(sprint: Sprint) {

    this.sprints = [...this.sprints, sprint];;
    this.sprintIds = [...this.sprintIds, sprint._id as string];
    this.cdRef.detectChanges();
  }

}
