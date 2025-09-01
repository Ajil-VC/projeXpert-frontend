import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Team } from '../../../../../../core/domain/entities/team.model';
import { SearchPipe } from '../../../../../../core/pipes/search.pipe';
import { KanbanService } from '../../data/kanban.service';
import { Sprint } from '../../../../../../core/domain/entities/sprint.model';
import { CommentSectionComponent } from "../../../../components/comment-section/comment-section.component";
import { AuthService } from '../../../../../auth/data/auth.service';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../../../../../core/data/notification.service';
import { LoaderComponent } from '../../../../../../core/presentation/loader/loader.component';
import { LoaderService } from '../../../../../../core/data/loader.service';
import { ConfirmDialogComponent } from '../../../../../reusable/confirm-dialog/confirm-dialog.component';
import { catchError, EMPTY, iif, map, of, switchMap, tap } from 'rxjs';
import { TaskHistory } from '../../../../../../core/domain/entities/taskhistory.model';

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
    CommentSectionComponent,
    MatIcon,
    LoaderComponent
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  @ViewChild('form') form!: NgForm;

  task!: Task;
  subTasks: Task[] = [];
  userRole!: string;
  teamMembers: Team[] = [];
  isSaved: boolean = false;
  newSubtaskTitle: string = '';
  showSubtasks: boolean = false;
  taskTitle: string = `Edit task`;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, userRole: string, daysLeft: string },
    private shared: SharedService,
    private kanbanSer: KanbanService,
    private authSer: AuthService,
    private cd: ChangeDetectorRef,
    private toast: NotificationService,
    private loader: LoaderService,
    private dialog: MatDialog
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
  isHistoryActive: Boolean = false;
  history: TaskHistory[] = [];

  imagePreviews: string[] = [];
  droppedFiles: File[] = [];

  activeSubtaskIndex: number | null = null;
  searchTerm: string = '';

  ngOnInit() {

    this.setDaysLeft();

    this.shared.getTeamMembers().subscribe({
      next: (res) => {
        this.teamMembers = res.data;

      },
      error: (err) => {
        this.toast.showError('Error while getting team members.');
      }
    });

    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })

    this.kanbanSer.getSubtasks(this.task._id).subscribe({
      next: (res) => {
        if (res.status) {
          this.subTasks = res.result;
        }
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve the data.');
      }
    });


  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }


  get sprintName(): string | null {
    const sprint = this.task?.sprintId as Sprint;
    return sprint?.name as string ?? null;
  }

  get parentName(): string {
    if (typeof this.task.parentId !== 'string') {
      return this.task.parentId.title
    }
    return '';
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

    iif(
      () => !!this.assigningUserId,
      this.kanbanSer.assignIssue(this.task._id, this.assigningUserId),
      of({ status: true })
    ).pipe(
      switchMap(res => {

        if (res.status) {
          this.isSaved = true;
          if (this.assigningUserId && 'data' in res) {
            this.shared.taskUpdateSubject.next(res.data);
            this.toast.showSuccess('Reassigned the task successfully.');
          }

          return this.kanbanSer.updateIssueStatus(this.task._id, this.form.value.status).pipe(
            map(() => false),
            catchError(err => {
              return of(true);
            }),
            switchMap((skipStatus: boolean) => this.kanbanSer.updateTaskDetails(formData, skipStatus))
          )
        }
        return EMPTY
      })
    ).subscribe({
      next: (res: { status: boolean, result: Task }) => {

        if (res.status) {
          this.data.task = res.result;
          this.dialogRef.close(this.data.task);
          this.toast.showSuccess('Task updated successfully');
        }

        return;
      },
      error: (err) => {
        this.dialogRef.close();
      }
    });


  }

  onStatusChange(subtask: Task) {

    this.kanbanSer.updateIssueStatus(subtask._id, subtask.status).subscribe()

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

  setTaskTitle() {
    if (!this.showComments && !this.showSubtasks && !this.isHistoryActive) {
      this.taskTitle = `Edit task`;
    } else if (this.showComments) {
      this.taskTitle = `Comments on ${this.task.title}`;
    } else if (this.showSubtasks) {
      this.taskTitle = `Subtasks of ${this.task.title}`;
    } else if (this.isHistoryActive) {
      this.taskTitle = `HIstory of ${this.task.title}`
    }
  }

  userEmail(subtask: Task) {
    if (typeof subtask.assignedTo !== 'string') {
      return subtask?.assignedTo?.email || '';
    }
    return '';
  }

  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.isHistoryActive = false;
      this.showSubtasks = false;
    }
    this.setTaskTitle();
    this.cd.detectChanges();
  }


  toggleSubtasksView() {
    this.showSubtasks = !this.showSubtasks;
    if (this.showSubtasks) {
      this.isHistoryActive = false;
      this.showComments = false;
    }
    this.setTaskTitle();
    this.cd.detectChanges();
  }
  removeSubtask(subtask: Task) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Remove Task',
        message: `Are you sure you want to delete "${subtask.title}"?`,
        confirmButton: 'Remove',
        cancelButton: 'Cancel'
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.kanbanSer.removeSubtask(subtask._id).subscribe({
          next: (res) => {
            if (res.status) {
              const index = this.subTasks.findIndex(task => task._id === subtask._id);
              this.subTasks.splice(index, 1);
              this.toast.showSuccess('Task removed succesfully.');
            }
          },
          error: (err) => {
            this.toast.showError('Couldnt remove the task.');
          }
        })

      }
    });

  }
  addSubtask() {
    this.loader.show();
    this.kanbanSer.createSubTask(this.newSubtaskTitle, this.task._id).subscribe({
      next: (res) => {
        if (res.status) {
          this.newSubtaskTitle = '';
          this.toast.showSuccess('Task Added successfully.');
          this.subTasks.unshift(res.result);
          this.loader.hide();
        }
      },
      error: (err) => {
        this.loader.hide();
        this.toast.showError('Couldnt create subtask.');
      }
    })
  }

  setActiveInput(index: number) {
    this.activeSubtaskIndex = index;
    this.searchTerm = '';
  }

  onInputChange(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;

  }

  updateAssignee(subtask: Task, index: number, email: string) {

    if (email.trim() === '') {
      this.toast.showWarning('Please select an email from the list.');
      return;
    }

    const user = this.teamMembers.find(user => user.email == email);

    let userId = 'null';
    let message = `Are you sure you want to assign ${email} to "${subtask.title}"?`;
    let title = 'Assign task';
    let confirmButton = 'Assign';


    if (user && user.email === email) {
      userId = user._id;
    } else if (!user) {

      message = `Are you sure you want to remove the assignee from task ${subtask.title}?`;
      title = 'No user found!';
      confirmButton = 'Remove assignee';

    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmButton,
        cancelButton: 'Cancel'
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.loader.show();
        this.kanbanSer.assignIssue(subtask._id, userId).subscribe({
          next: (res) => {
            if (res.status) {
              const index = this.subTasks.findIndex(task => task._id === res.data._id);
              this.subTasks[index] = res.data;
              this.toast.showSuccess(res.message);
              this.loader.hide();
            }
          },
          error: (err) => {
            this.loader.hide();
            this.toast.showError('Please try again, Couldnt assign user to the particular task.');
          }
        })

        this.subTasks[index].assignedTo = this.searchTerm;
        this.searchTerm = '';
        this.activeSubtaskIndex = null;

      }
    });

  }

  assignUserToSubtask(user: Team, index: number, input: HTMLInputElement) {

    this.subTasks[index].assignedTo = user._id;
    input.value = user.email;
    this.searchTerm = '';
    this.activeSubtaskIndex = null;
  }


  gethistoryDescription(history: TaskHistory) {

    if (history.actionType === "ASSIGN") {

      let assignedTo = history.details?.assignedTo?.email ?
        `Assigned the task to ${history.details?.assignedTo?.email}` : `Removed assignee`;

      return assignedTo;
    } else if (history.actionType === "STATUS_CHANGE") {
      return `Changed the status from ${history.details.oldStatus} to ${history.details.newStatus}`;
    } else if (history.actionType === "DELETE_SUBTASK") {
      return `Deleted subtask ${history.details.subtaskTitle}`;
    } else if (history.actionType === "CREATE_SUBTASK") {
      return `Created a new subtask called ${history.details.subtaskTitle}`;
    } else if (history.actionType === "UPDATED") {
      return `Updated the task`;
    }

    return '';
  }
  showHistory() {

    if (this.isHistoryActive) {
      this.isHistoryActive = false;
      this.setTaskTitle();
      this.cd.detectChanges();
      return;
    }
    this.kanbanSer.getTaskHistory(this.task._id).subscribe({
      next: (res) => {

        this.history = res.result;
        this.isHistoryActive = !this.isHistoryActive;
        if (this.isHistoryActive) {
          this.showSubtasks = false;
          this.showComments = false;
        }
        this.setTaskTitle();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve the history.');
      }
    })

  }

}
