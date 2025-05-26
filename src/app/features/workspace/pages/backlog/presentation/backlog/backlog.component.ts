import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BacklogHeaderComponent } from "../backlog-header/backlog-header.component";
import { EpicsComponent } from "../epics/epics.component";
import { SprintComponent } from "../sprint/sprint.component";
import { CreateBacklogComponent } from "../create-backlog/create-backlog.component";
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { BacklogService } from '../../data/backlog.service';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';


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

  constructor(private shared: SharedService, private backlogSer: BacklogService, private cdRef: ChangeDetectorRef) { }

  trackBySprintId(index: number, sprint: Sprint) {
    return sprint._id;
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

      },
      error: (err) => {
        console.error('Error occured while adding issue', err);
      }
    });

    this.shared.currentPro$.subscribe({
      next: (res) => {
        if (!res) {
          this.isProjectSelected = false;
        } else {
          this.isProjectSelected = true;
        }
      },
      error: (err) => {
        console.error("Something went wrong", err);
      }
    })


    //tasks on init
    this.shared.getTasksInProject().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {

        this.epics = res.result.filter(issue => issue.type === 'epic');
        this.backlogs = res.result.filter(issue => (issue.sprintId == null && issue.type !== 'epic'));

      },
      error: (err) => {
        console.log("Error occured while getting tasks", err);
      }
    })

    //Getting tasks on project change from header
    this.shared.taskSub$.subscribe({
      next: (res) => {
        const tasks = res as Task[];
        this.epics = tasks.filter(issue => issue.type === 'epic');
        this.backlogs = tasks.filter(issue => issue.sprintId == null && issue.type !== 'epic');

      },
      error: (err) => {
        console.log("Error occured while getting tasks", err);
      }
    });


    //Here im initiating sprints to load the backlog page
    this.backlogSer.getSprints().subscribe({
      next: (res: { status: boolean, result: Sprint[] }) => {
        if (!res.status) {
          console.error('Error occured while getting sprints');
          return;
        }
        this.sprints = res.result;
        this.sprintIds = this.sprints.map(sprint => sprint._id as string);
      },
      error: (err) => {
        console.error('Error occured while getting sprints', err);
      }
    });
    //Here Im retrieving the sprint array on project change
    this.backlogSer.sprint$.subscribe({
      next: (res: Sprint[]) => {
        this.sprints = res;
        this.sprintIds = this.sprints.map(sprint => sprint._id as string);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error occured while getting sprints', err);
      }
    });
    //Here Im adding sprint into the backlog on adding sprint 
    this.backlogSer.addSprint$.subscribe({
      next: (res: Sprint) => {

        this.sprints = this.sprints.concat(res);
        this.sprintIds.push(res._id as string);
      },
      error: (err) => {
        console.error('Error occured while adding sprint', err);
      }
    });

  }

}
