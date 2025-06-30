import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';

@Component({
  selector: 'app-task-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task!: Task;

  endDate: any = '';
  daysLeft = '';
  ngOnChanges() {
    this.endDate = (this.task?.sprintId !== null && typeof this.task?.sprintId !== 'string') ? this.task?.sprintId.endDate : '';

    const endDate = new Date(this.endDate);
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

  get sprintName(): string | null {
    const sprint = this.task?.sprintId as Sprint;
    return sprint?.name as string ?? null;
  }

  ngOnInit() {
    // this.task.
  }

}
