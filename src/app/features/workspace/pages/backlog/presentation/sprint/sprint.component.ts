import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreateIssueButtonComponent } from "../create-issue-button/create-issue-button.component";
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';
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

@Component({
  selector: 'app-sprint',
  imports: [CreateIssueButtonComponent, IssueRowComponent, CommonModule, DragDropModule],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css'
})
export class SprintComponent implements OnChanges {

  @Input() sprint!: Sprint;
  @Input() allSprintIds: string[] = [];
  issues: Task[] = [];
  connectedDropListIds: string[] = [];

  currentDivId: string = '';
  selectedIssue: Set<string> = new Set();
  filteredIssuesShallow: Task[] = [];
  selectedEpics: Array<string> = [];

  issueCount = 0;


  issueCreationButton: string = this.sprint?._id as string || '';
  isIssueInSprint: boolean = false;

  constructor(private backlogSer: BacklogService,
    private dialog: MatDialog,
    private router: Router,
    private shared: SharedService) { }


  onDrop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(this.filteredIssuesShallow, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.filteredIssuesShallow,
        event.previousIndex,
        event.currentIndex
      );
      // Optionally emit event to parent to update task.sprintId = this.sprintId

      const prevContainerId = event.previousContainer.id;
      const movedTaskId = event.item.data?._id;

      this.backlogSer.dragDropUpdation(prevContainerId, event.container.id, movedTaskId).subscribe({
        next: (res: { status: boolean, message: string, result: Task }) => {

          const foundTask = this.filteredIssuesShallow.find(task => task._id === res.result._id);
          if (foundTask) {
            foundTask.sprintId = res.result.sprintId;
          }
          const foundInBacklog = this.issues.find(task => task._id === res.result._id);
          if (foundInBacklog) {
            foundInBacklog.sprintId = res.result.sprintId;
          }
        },
        error: (err) => {
          console.error('Something went wrong while updating moved task.');
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

  ngOnInit() {

    this.backlogSer.selectedEpics$.subscribe({
      next: (res: Set<string>) => {
        this.selectedEpics = Array.from(res);

        this.filteredIssues();
      },
      error: (err) => {
        console.error('Error occured while getting selected epics', err);
      }
    });

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

    if (this.selectedEpics.length === 0) {
      this.filteredIssuesShallow = this.issues.filter(issue => {
        if (issue.sprintId && !issue.epicId) {
          issue.assignedTo = issue.assignedTo as Team;
          this.issueCount++;
          return true;
        }
        return false
      });
      if (this.filteredIssuesShallow.length === 0) {
        this.isIssueInSprint = true;
      }
      else {
        this.isIssueInSprint = false;
      }
      return;
    }

    this.filteredIssuesShallow = this.issues.filter(issue => {
      for (let epic of this.selectedEpics) {
        if (epic === issue.epicId) {
          this.issueCount++;
          return true;
        }
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
              console.error('something went wrong while starting sprint', err);
            }
          })
        }
      }
    })
  }

  completeSprint() {
    console.log('wORKING');
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
