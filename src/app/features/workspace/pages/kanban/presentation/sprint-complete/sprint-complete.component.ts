import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { KanbanService } from '../../data/kanban.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { Sprint, SprintTaskGroup } from '../../../../../../core/domain/entities/sprint.model';

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


  ],
  templateUrl: './sprint-complete.component.html',
  styleUrl: './sprint-complete.component.css'
})
export class SprintCompleteComponent {

  selectedSprintId: string = '';
  moveToSprintId: string = '';
  activeSprints: SprintTaskGroup[] = [];
  availableSprints: Array<Sprint> = [];
  selectedSprint!: Sprint;
  isCompleting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SprintCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupedTasks: Array<SprintTaskGroup> },
    private shared: SharedService,
    private kanbanSer: KanbanService
  ) {
    this.activeSprints = this.data.groupedTasks;
    console.log('indenne', this.data.groupedTasks, 'varund')
  }

  ngOnInit() {

    this.kanbanSer.getAvailableSprints().subscribe({
      next: (res) => {
        this.availableSprints = res.result;
        console.log(this.availableSprints, 'Res data.');
      },
      error: (err) => {
        console.error('Error occured while getting sprints.', err);
      }
    })
  }


  onCancel() {

  }


  onComplete() {

  }
}
