import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CreateIssueButtonComponent } from "../create-issue-button/create-issue-button.component";
import { CommonModule } from '@angular/common';
import { IssueRowComponent } from "../issue-row/issue-row.component";
import { Task } from '../../../../../../core/domain/entities/task.model';
import { BacklogService } from '../../data/backlog.service';
import { Team } from '../../../../../../core/domain/entities/team.model';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';

import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { NotificationService } from '../../../../../../core/data/notification.service';

@Component({
  selector: 'app-create-backlog',
  imports: [
    CreateIssueButtonComponent,
    CommonModule,
    IssueRowComponent,
    DragDropModule,
  ],
  templateUrl: './create-backlog.component.html',
  styleUrl: './create-backlog.component.css'
})
export class CreateBacklogComponent implements OnChanges {

  @Input() backlogs!: Task[];
  @Input() connectedSprintIds: string[] = [];
  @Input() allSprintIds: string[] = [];
  @Output() sprintCreated = new EventEmitter<Sprint>();

  filteredBacklogs: Task[] = [];
  issues = [];
  issueCount = 0;
  selectedEpics: Array<string> = [];
  currentDivId: string = '';
  selectedIssue: Set<string> = new Set();

  issueCreationButton: string = 'backlog';
  isBacklog: boolean = false;

  constructor(private backlogSer: BacklogService, private toast: NotificationService) { }


  onDrop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(this.filteredBacklogs, event.previousIndex, event.currentIndex);
    } else {

      transferArrayItem(
        event.previousContainer.data,
        this.backlogs,
        event.previousIndex,
        event.currentIndex
      );

      this.filteredIssues();

      const prevContainerId = event.previousContainer.id;
      const movedTaskId = event.item.data?._id;

      this.backlogSer.dragDropUpdation(prevContainerId, event.container.id, movedTaskId).subscribe({
        next: (res: { status: boolean, message: string, result: Task }) => {

          const foundTask = this.filteredBacklogs.find(task => task._id === res.result._id);
          if (foundTask) {
            foundTask.sprintId = res.result.sprintId;
          }
          const foundInBacklog = this.backlogs.find(task => task._id === res.result._id);
          if (foundInBacklog) {
            foundInBacklog.sprintId = res.result.sprintId;
          }
        },
        error: (err) => {
          this.toast.showError('Something went wrong while moving tasks.');
        }
      })
    }

  }




  ngOnInit() {

    this.backlogSer.addIssue$.subscribe({
      next: (res: Task) => {
        if (!res.sprintId) {
  console.log(this.backlogs,'Why???')
          this.backlogs.push(res);
          this.filteredIssues();
        }

      }
    });

    this.backlogSer.selectedEpics$.subscribe({
      next: (res: Set<string>) => {
        this.selectedEpics = Array.from(res);
        this.filteredIssues();
      }
    })
  }

  filteredIssues() {

    this.issueCount = 0;
    if (!this.backlogs || this.backlogs.length === 0) {
      this.isBacklog = true;
      return;
    };

    if (this.selectedEpics.length === 0) {
      this.filteredBacklogs = this.backlogs.filter(issue => {
        if (!issue.epicId) {
          issue.assignedTo = issue.assignedTo as Team;
          this.issueCount++;
          return true;
        }
        return false
      });

      if (this.filteredBacklogs.length === 0) {
        this.isBacklog = true;
      } else {
        this.isBacklog = false;
      }
      return;
    }

    this.filteredBacklogs = this.backlogs.filter(issue => {
      for (let epic of this.selectedEpics) {
        if (epic === issue.epicId) {
          this.issueCount++;
          return true;
        }
      }
      return false;
    });

    if (this.filteredBacklogs.length === 0) {
      this.isBacklog = true;
    }
    else {
      this.isBacklog = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['allSprintIds']) {
      this.connectedSprintIds = this.allSprintIds.map(id => `sprint-${id}`);
    }

    if (changes['backlogs'] && this.backlogs?.length > 0) {
      this.filteredIssues();
    } else {
      this.isBacklog = false;
    }

  }

  toggleBacklogCollapse(): void {
    // Logic to collapse/expand backlog section
  }

  startSprint(): void {
    // Logic to start the sprint with selected issues
  }

  handleDropdown(clickedId: string) {

    if (this.currentDivId === clickedId) {
      this.currentDivId = '';
      return;
    } else {
      this.currentDivId = '';
    }

    setTimeout(() => {
      this.currentDivId = clickedId;
    }, 0);
  }


  handleIssued(event: Task) {
    this.backlogs.find((issue) => {
      if (issue._id === event._id) {
        issue.assignedTo = event.assignedTo;
        return true;
      }
      return false;
    });

  };

  createSprint() {
    const issueIds = Array.from(this.selectedIssue);
    if (issueIds.length === 0) {
      this.toast.showError('Select issues', 'Heads Up');
      return;
    };
    this.backlogSer.createSprint(issueIds).subscribe({
      next: (res: { status: boolean, result: Sprint }) => {

        //Here IM sending the created sprint to the backlog service
        // this.backlogSer.addSprintSubject.next(res.result);
        this.sprintCreated.emit(res.result);

        const tasksToRemove = new Set((res.result.tasks as Task[]).map((task: Task) => task._id));
        this.backlogs = this.backlogs.filter(task => !tasksToRemove.has(task._id));

        // this.allSprintIds.push(res.result._id as string);

        this.connectedSprintIds.push(`sprint-${(res.result._id as string)}`)

        this.selectedIssue.clear();
        this.filteredIssues()

      },
      error: (err) => {
        this.toast.showError('Something went wrong while creating sprint')
      }
    })
  };

  handleSelectedIssue(issueId: string) {

    if (this.selectedIssue.has(issueId)) {
      this.selectedIssue.delete(issueId);
    } else {
      this.selectedIssue.add(issueId);
    }
  }

}
