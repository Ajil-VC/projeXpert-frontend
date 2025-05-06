import { Component } from '@angular/core';

@Component({
  selector: 'app-sprint',
  imports: [],
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
