import { Component, Inject } from '@angular/core';
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
export class SprintCompleteComponent {

  moveToSprintId: string | null = null;
  activeSprints: SprintTaskGroup[] = [];
  availableSprints: Array<Sprint> = [];
  selectedSprint!: Sprint;
  isCompleting: boolean = false;
  incompletedTasks: number = 0;
  canShow: boolean = false;

  completedTasksInSelectedSprint: Array<Task> = [];

  constructor(
    public dialogRef: MatDialogRef<SprintCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupedTasks: Array<SprintTaskGroup> },
    private shared: SharedService,
    private kanbanSer: KanbanService
  ) {
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
