import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CreateIssueButtonComponent } from "../create-issue-button/create-issue-button.component";
import { Sprint, SprintTaskGroup } from '../../../../../../core/domain/entities/sprint.model';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { IssueRowComponent } from "../issue-row/issue-row.component";
import { Team } from '../../../../../../core/domain/entities/team.model';
import { BacklogService } from '../../data/backlog.service';
import { CommonModule } from '@angular/common';

import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { SprintDialogComponent } from '../sprint-dialog/sprint-dialog.component';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { TaskDetailsComponent } from '../../../kanban/presentation/task-details/task-details.component';
import { NotificationService } from '../../../../../../core/data/notification.service';
import { SprintCompleteComponent } from '../../../kanban/presentation/sprint-complete/sprint-complete.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sprint',
  imports: [CreateIssueButtonComponent, IssueRowComponent, CommonModule, DragDropModule, MatTooltipModule],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css'
})
export class SprintComponent implements OnChanges {

  @Input() sprint!: Sprint;
  @Input() allSprintIds: string[] = [];
  @Output() itemDropped = new EventEmitter<Task>();

  issues: Task[] = [];
  connectedDropListIds: string[] = [];

  daysLeft: string = '';

  currentDivId: string = '';
  selectedIssue: Set<string> = new Set();
  filteredIssuesShallow: Task[] = [];
  selectedEpics: Set<string> = new Set();

  issueCount = 0;


  issueCreationButton: string = this.sprint?._id as string || '';
  isIssueInSprint: boolean = false;

  constructor(private backlogSer: BacklogService,
    private dialog: MatDialog,
    private router: Router,
    private shared: SharedService,
    private toast: NotificationService
  ) {

  }


  onDrop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(this.filteredIssuesShallow, event.previousIndex, event.currentIndex);
    } else {

      const prevContainerId = event.previousContainer.id;
      const movedTaskId = event.item.data?._id;

      this.backlogSer.dragDropUpdation(prevContainerId, event.container.id, movedTaskId).subscribe({
        next: (res: { status: boolean, message: string, result: Task }) => {

          if (res.status) {
            transferArrayItem(
              event.previousContainer.data,
              this.issues,
              event.previousIndex,
              event.currentIndex
            );


            this.shared.tasksSubject.next(event.item.data);

            //Here im updating the backlog array in parent to let the backlog component know about it.
            if (prevContainerId === "backlog-drop-list") {

              this.itemDropped.emit(event.item.data)

            }

            const foundTask = this.filteredIssuesShallow.find(task => task._id === res.result._id);
            if (foundTask) {
              foundTask.sprintId = res.result.sprintId;
              this.filteredIssuesShallow = [...this.filteredIssuesShallow];

            }
            const foundInBacklog = this.issues.find(task => task._id === res.result._id);
            if (foundInBacklog) {
              foundInBacklog.sprintId = res.result.sprintId;

            }

            this.filteredIssues();
          }
        },
        error: (err) => {
          this.toast.showError('Something went wrong while updating moved task.');
        }
      })

    }
  }


  getOtherSprintIds(): string[] {
    // Example: dynamically generate sprint IDs
    return this.allSprintIds
      .filter(sprintId => sprintId !== this.sprint._id)
      .map(sprintId => `sprint-${sprintId}`);
  }


  getDaysLeftForTheSprint() {

    if (!this.sprint?.endDate) {
      this.daysLeft = 'Not Started';
      return;
    }

    const endDate = new Date(this.sprint.endDate);
    const today = new Date();

    // Optionally normalize the current date and end date to ignore the time of day:
    // This is useful if you want to compute full days between dates rather than accounting for hours/minutes.
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const diffTime = endDate.getTime() - today.getTime();

    // Convert the time difference from milliseconds to days
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysLeft = daysLeft < 0 ? 'Time up' : daysLeft + 'days left';

  }
  ngOnInit() {

    this.getDaysLeftForTheSprint();

    this.backlogSer.selectedEpics$.subscribe({
      next: (res: Set<string>) => {
        this.selectedEpics = res;

        this.filteredIssues();
      },
      error: (err) => {
        this.toast.showError('Error occured while getting selected epics');
      }
    });

    this.shared.taskSub$.subscribe({
      next: (res: Task) => {
        if (res.sprintId === this.sprint._id) {

          const ind = this.issues.findIndex(ep => ep._id === res._id);
          this.issues.splice(ind, 1);
        }
      }
    })

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.connectedDropListIds = ['backlog-drop-list', ...this.getOtherSprintIds()];

    if (changes['sprint'] && changes['sprint'].currentValue) {
      this.issues = changes['sprint'].currentValue.tasks as unknown as Task[];
      this.filteredIssues();
    }

    this.issueCreationButton = this.sprint?._id as string || '';

  }


  filteredIssues() {

    this.issueCount = 0;
    if (!this.issues || this.issues.length === 0) {
      this.isIssueInSprint = true;
      return;
    }

    if (this.selectedEpics.size === 0) {

      const filtered = this.issues.filter(issue => !!issue.sprintId);
      filtered.forEach(issue => {
        // issue.assignedTo = issue.assignedTo as Team;
        this.issueCount++;
      });

      this.filteredIssuesShallow = filtered;

      if (this.filteredIssuesShallow.length === 0) {
        this.isIssueInSprint = true;
      }
      else {
        this.isIssueInSprint = false;
      }
      return;
    }


    this.filteredIssuesShallow = this.issues.filter(issue => {

      if (issue?.epicId && this.selectedEpics.has((issue.epicId as Task)._id)) {
        this.issueCount++;
        return true;
      }

      return false;
    });


    if (this.filteredIssuesShallow.length === 0) {
      this.isIssueInSprint = true;
    }
    else {
      this.isIssueInSprint = false;
    }
  }

  completeSprint() {
    this.router.navigate(['user/board']);
  }

  toggleSprintCollapse(): void {
    // Logic to collapse/expand sprint section
  }

  addDates(): void {
    // Logic to add dates to the sprint
  }

  startSprint(): void {
    // Logic to start the sprint
    const dialogRef = this.dialog.open(SprintDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe({
      next: (result: { sprintName: string, duration: number, startDate: Date }) => {
        if (result) {
          if (result.sprintName == '') {
            result.sprintName = this.sprint.name as string;
          }
          this.backlogSer.startSprint(this.sprint._id as string, result.sprintName, result.duration, result.startDate).subscribe({
            next: (res: { status: boolean, message: string, result: Sprint }) => {
              this.sprint.name = res.result.name;
              this.sprint.status = res.result.status;
              // this.shared.tasksSubject.next(res.result.tasks);
              this.router.navigate(['/user/board']);
            },
            error: (err) => {

              if (err.statusText === "Conflict") {
                this.toast.showError(err.error['message'] || 'Conflict');
                return;
              }
              this.toast.showError('something went wrong while starting sprint');
            }
          })
        }
      }
    })
  }



  handleSelectedIssue(issueId: string) {

    if (this.selectedIssue.has(issueId)) {
      this.selectedIssue.delete(issueId);
    } else {
      this.selectedIssue.add(issueId);
    }
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
  };


  handleIssued(event: Task) {
    this.issues.find((issue) => {
      if (issue._id === event._id) {
        issue.assignedTo = event.assignedTo;
        return true;
      }
      return false;
    });

  };


}
