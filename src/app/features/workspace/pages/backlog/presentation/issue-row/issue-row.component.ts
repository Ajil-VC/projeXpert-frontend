import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-issue-row',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './issue-row.component.html',
  styleUrl: './issue-row.component.css'
})
export class IssueRowComponent {


  @Input() issue!: Task;
  @Output() assign = new EventEmitter<any>();

  isClicked: boolean = false;

  defaultStatus: string = 'status-default';
  getTypeClass(): string {
    return `type-${this.issue.type.toLowerCase()}`;
  }

  getStatusClass(): string {
    switch (this.issue.status) {
      case 'todo':
        return 'status-todo';
      case 'in-progress':
        return 'status-in-progress';
      case 'done':
        return 'status-done';
      default:
        return 'status-default';
    }
  }

  assignIssue(): void {
    this.assign.emit(this.issue);
  }

}
