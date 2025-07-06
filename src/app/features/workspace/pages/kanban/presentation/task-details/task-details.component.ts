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
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';
import { CommentSectionComponent } from "../../../../components/comment-section/comment-section.component";

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
    SearchPipe,
    CommentSectionComponent
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  @ViewChild('form') form: NgForm | undefined;

  task!: Task;
  userRole!: string;
  teamMembers: Team[] = [];
  isSaved: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, userRole: string, daysLeft: string },
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

  showComments: boolean = false;

  imagePreviews: string[] = [];
  droppedFiles: File[] = [];

  ngOnInit() {

    this.setDaysLeft();

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

  get sprintName(): string | null {
    const sprint = this.task?.sprintId as Sprint;
    return sprint?.name as string ?? null;
  }

  setDaysLeft() {
    if (this.task && typeof this.task.assignedTo !== 'string') {
      this.email = this.task.assignedTo?.email || 'Not Assigned';
    }
    this.endDate = (this.task?.sprintId !== null && typeof this.task?.sprintId !== 'string') ? this.task?.sprintId.endDate : '';
    if (!this.endDate) {
      this.daysLeft = this.data.daysLeft || 'Not Started';
      return;
    }
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


  onCancel() {

    this.dialogRef.close();

  }

  onSave() {

    if (this.isSaved) return;
    this.isSaved = true;
    const formData = new FormData();

    if (!this.form || this.form.invalid) {
      return;
    } else if (this.assigningUser !== this.userSearchTerm) {
      console.warn('Need to select member from the team.');
      this.customEmailError = true;
      return;
    }

    if (!this.userSearchTerm || this.userSearchTerm.trim().length == 0) {
      this.assigningUser = '';
      this.assigningUserId = '';
    }
    this.customEmailError = false;

    formData.append('assigningUserId', this.assigningUserId);
    formData.append('task', JSON.stringify(this.task));

    this.droppedFiles.forEach(file => {
      formData.append('attachments', file);
    });


    this.kanbanSer.updateTaskDetails(formData).subscribe({
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




  onDrop(event: DragEvent) {

    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          this.droppedFiles.push(file);
          this.previewImage(file);
        }
      }
    }

  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.droppedFiles.splice(index, 1);
  }


  removeAttachment(publicId: string) {

    const confirmed = confirm('Are you sure you want to delete this attachment?');
    if (!confirmed) return;

    this.kanbanSer.deleteAttachmentFromCloudinary(publicId, this.task._id).subscribe({
      next: (res) => {
        const data = res as { status: boolean, message: string, result: Task };
        if (data.status) {
          this.task = data.result;
        }
      },
      error: (err) => {
        console.error('Failed to delete attachment:', err);
      }
    });
  }


  toggleComments() {
    this.showComments = !this.showComments;
  }

}
