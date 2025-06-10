import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { User } from '../../../../../../core/domain/entities/user.model';
import { Team } from '../../../../../../core/domain/entities/team.model';
import { SearchPipe } from '../../../../../../core/pipes/search.pipe';
import { KanbanService } from '../../data/kanban.service';

@Component({
  selector: 'app-task-details',
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatDialogContent,
    MatFormFieldModule,
    MatLabel,
    MatOptionModule,
    MatDialogActions,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SearchPipe
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  @ViewChild('form') form: NgForm | undefined;

  task!: Task;
  userRole!: string;
  teamMembers: Team[] = [];

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, userRole: string },
    private shared: SharedService,
    private kanbanSer: KanbanService
  ) {
    this.task = this.data.task;
    this.userRole = this.data.userRole;
  }

  email: string = '';
  endDate: any = '';
  daysLeft = '';

  userSearchTerm: string = '';
  assigningUser: string = '';
  customEmailError: boolean = false;
  assigningUserId: string = '';

  ngOnInit() {

    if (this.task && typeof this.task.assignedTo !== 'string') {
      this.email = this.task.assignedTo?.email || 'Not Assigned';
    }
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


    if (this.userRole === 'admin') {
      this.shared.getTeamMembers().subscribe({
        next: (res) => {
          this.teamMembers = res.data;
        },
        error: (err) => {
          console.log('Error while getting team members.', err);
        }
      })
    }

  }

  onCancel() {

    this.dialogRef.close();

  }

  onSave() {
    if (!this.form || this.form.invalid) {
      console.log('Hello there')
      return;
    } else if (this.assigningUser !== this.userSearchTerm) {
      console.error('Need to select member from the team.');
      this.customEmailError = true;
      return;
    }

    if (!this.userSearchTerm || this.userSearchTerm.trim().length == 0) {
      this.assigningUser = '';
      this.assigningUserId = '';
    }
    this.customEmailError = false;

    this.kanbanSer.updateTaskDetails(this.task, this.assigningUserId).subscribe({
      next: (res) => {
        this.data.task = res.result;
        this.dialogRef.close(this.data.task);
        return;
      },
      error: (err) => {
        console.error('error occured while updating task details.', err);
      }
    })

  }

  assignUser(user: Team) {
    this.customEmailError = false;
    this.userSearchTerm = user.email;
    this.assigningUser = user.email;
    this.assigningUserId = user._id;
  }
}
