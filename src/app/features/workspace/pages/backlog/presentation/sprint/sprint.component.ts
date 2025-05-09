import { Component } from '@angular/core';
import { CreateIssueButtonComponent } from "../create-issue-button/create-issue-button.component";

@Component({
  selector: 'app-sprint',
  imports: [CreateIssueButtonComponent],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css'
})
export class SprintComponent {

  sprint = {
    id: '1',
    title: 'SCRUM Sprint 1',
    startDate: null,
    endDate: null,
    issues: []
  };

  issueCount = 0;

  toggleSprintCollapse(): void {
    // Logic to collapse/expand sprint section
  }

  addDates(): void {
    // Logic to add dates to the sprint
  }

  startSprint(): void {
    // Logic to start the sprint
  }

  createIssue(): void {
    // Logic to create a new issue
  }

}
