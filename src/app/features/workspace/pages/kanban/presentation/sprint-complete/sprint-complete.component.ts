import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { KanbanService } from '../../data/kanban.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { Sprint, SprintTaskGroup } from '../../../../../../core/domain/entities/sprint.model';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { AuthService } from '../../../../../auth/data/auth.service';

@Component({
  selector: 'app-sprint-complete',
  imports: [
    MatDialogContent,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatLabel,
    MatOptionModule,
    MatDialogActions,
    MatSelectModule

  ],
  templateUrl: './sprint-complete.component.html',
  styleUrl: './sprint-complete.component.css'
})
export class SprintCompleteComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SprintCompleteComponent>>(MatDialogRef);
  data = inject<{
    groupedTasks: SprintTaskGroup[];
}>(MAT_DIALOG_DATA);
  private shared = inject(SharedService);
  private kanbanSer = inject(KanbanService);
  private authSer = inject(AuthService);


  moveToSprintId: string | null = null;
  activeSprints: SprintTaskGroup[] = [];
  availableSprints: Sprint[] = [];
  selectedSprint!: Sprint;
  isCompleting = false;
  incompletedTasks = 0;
  canShow = false;

  completedTasksInSelectedSprint: Task[] = [];

  constructor() {
    this.activeSprints = this.data.groupedTasks;
  }

  ngOnInit() {

    this.kanbanSer.getAvailableSprints().subscribe({
      next: (res) => {
        this.availableSprints = res.result;
      },
      error: (err) => {
        console.error('Error occured while getting sprints.', err);
      }
    });

    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }


  updateIncompleted(selectedSprint: Sprint) {
    this.completedTasksInSelectedSprint = [];
    const result = this.availableSprints.find(sprint => sprint._id === selectedSprint._id);
    this.incompletedTasks = 0;
    if (!result) {
      return;
    } else {

      for (let task of result?.tasks) {
        task = task as Task;
        if (task.status !== 'done') {
          this.incompletedTasks++;
        } else {
          this.completedTasksInSelectedSprint.push(task);
        }
      }

      this.canShow = (this.incompletedTasks === 0) ? false : true;
    }
  }


  get selectedSprintId(): string | null {
    return this.selectedSprint?._id as string ?? null;
  }


  onCancel() {
    this.dialogRef.close();
  }


  onComplete() {

    const sprintIdToSaveTasks = this.canShow ? this.moveToSprintId : null;

    this.kanbanSer.completeSprint(this.selectedSprint._id as string, sprintIdToSaveTasks).subscribe({
      next: (res) => {
        res.completedTasks = this.completedTasksInSelectedSprint;
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Error occured while updating task details.', err);
        this.dialogRef.close();
      }
    });
  }
}
