import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreateIssueButtonComponent } from "../create-issue-button/create-issue-button.component";
import { CommonModule } from '@angular/common';
import { IssueRowComponent } from "../issue-row/issue-row.component";
import { Task } from '../../../../../../core/domain/entities/task.model';
import { BacklogService } from '../../data/backlog.service';

@Component({
  selector: 'app-create-backlog',
  imports: [
    CreateIssueButtonComponent,
    CommonModule,
    IssueRowComponent
  ],
  templateUrl: './create-backlog.component.html',
  styleUrl: './create-backlog.component.css'
})
export class CreateBacklogComponent implements OnChanges {

  @Input() backlogs!: Task[];
  filteredBacklogs!: Task[];
  issues = [];
  issueCount = 0;
  selectedEpics: Array<string> = [];

  issueCreationButton: string = 'backlog';
  isBacklog: boolean = false;

  constructor(private backlogSer: BacklogService) { }
  ngOnInit() {
    this.backlogSer.addIssue$.subscribe({
      next: (res: Task) => {
        this.backlogs.push(res);
        this.filteredBacklogs = this.backlogs;
        this.filteredIssues();
        this.isBacklog = true;
      },
      error: (err) => {
        console.error('Error occured while adding issue', err);
      }
    });

    this.backlogSer.selectedEpics$.subscribe({
      next: (res: Set<string>) => {
        this.selectedEpics = Array.from(res);

        this.filteredIssues();
      },
      error: (err) => {
        console.error('Error occured while getting selected epics', err);
      }
    })
  }

  filteredIssues() {

    if (this.selectedEpics.length === 0) {
      this.filteredBacklogs = this.backlogs;
      return;
    }

    this.filteredBacklogs = this.backlogs.filter(issue => {
      for (let epic of this.selectedEpics) {
        if (epic === issue.epicId) {
          return true;
        }
      }
      return false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backlogs'] && this.backlogs?.length > 0) {
      this.filteredIssues();
      this.isBacklog = true;
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

}
