import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoryPoint, Task } from '../../../../../../core/domain/entities/task.model';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { BacklogService } from '../../../backlog/data/backlog.service';

@Component({
  selector: 'app-task-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task!: Task;
  @Output() taskUpdation = new EventEmitter<Task>();


  fibo: StoryPoint[] = [0, 1, 2, 3, 5, 8, 13, 21];

  endDate: any = '';
  daysLeft = '';
  ngOnChanges() {

    if (this.task.parentId) {
      if (typeof this.task.parentId !== 'string') {

        this.setDaysLeft(this.task.parentId)
      }
    } else {
      this.setDaysLeft(this.task);
    }

  }


  constructor(private dialog: MatDialog, private _backlogSer: BacklogService) { }

  setDaysLeft(task: Task) {

    this.endDate = (task?.sprintId !== null && typeof task?.sprintId !== 'string') ? task?.sprintId.endDate : '';

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
    if (this.task.parentId && typeof this.task.parentId !== 'string' && this.task.parentId.sprintId !== 'string') {
      const sprint = this.task.parentId.sprintId as Sprint;
      return sprint?.name as string ?? null;
    }
    const sprint = this.task?.sprintId as Sprint;
    return sprint?.name as string ?? null;
  }


  ngOnInit() {
    // this.task.
    // console.log(this.task)
  }



  taskDetails(subtaskView: boolean = false): void {

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      data: {
        task: { ...this.task },
        subtaskView,
        subtasks: this.task.subtasks
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.task = result;
        this.taskUpdation.emit(this.task);

      }
    });

  }


  updateStoryPoint(event: Event) {
    const selected = Number((event.target as HTMLSelectElement).value);
    this._backlogSer.updateStoryPoint(selected, this.task._id).subscribe({
      next: (res) => {
        if (res.status) {
          this.task.storyPoints = selected as StoryPoint;
        }
      }
    })

  }

}
