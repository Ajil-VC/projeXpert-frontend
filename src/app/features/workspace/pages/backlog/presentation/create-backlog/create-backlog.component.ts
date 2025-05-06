import { Component } from '@angular/core';

@Component({
  selector: 'app-create-backlog',
  imports: [],
  templateUrl: './create-backlog.component.html',
  styleUrl: './create-backlog.component.css'
})
export class CreateBacklogComponent {

  // : Issue[]
  issues = [];
  issueCount = 0;
  
  toggleBacklogCollapse(): void {
    // Logic to collapse/expand backlog section
  }
  
  startSprint(): void {
    // Logic to start the sprint with selected issues
  }
  
  createIssue(): void {
    // Logic to create a new issue
  }

}
