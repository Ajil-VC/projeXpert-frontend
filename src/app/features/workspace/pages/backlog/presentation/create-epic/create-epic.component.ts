import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from '../../../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-create-epic',
  imports: [ReactiveFormsModule, FormsModule,
    CommonModule, MatDialogContent, MatFormField, MatLabel,
    MatDatepickerModule, MatDialogActions, MatError, MatInputModule],
  templateUrl: './create-epic.component.html',
  styleUrl: './create-epic.component.css'
})
export class CreateEpicComponent {

  epicForm: FormGroup;
  minDate = new Date();
  minEndDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEpicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { issue: Task }
  ) {

    this.epicForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    const epic = this.data.issue;
    if (epic) {
      console.log(' asd fasd asdf asdf')
      const startDate = epic.startDate ? new Date(epic.startDate) : '';
      const minEnd = startDate ? new Date(startDate) : '';

      if (startDate && minEnd) {
        minEnd.setDate(startDate.getDate() + 1);
        this.minDate = startDate;
        this.minEndDate = minEnd;

        this.epicForm.patchValue({
          title: epic.title || '',
          description: epic.description || '',
          startDate,
          endDate: minEnd
        });

      }

    }

  }

  ngOnInit() {

    this.epicForm.get('startDate')?.valueChanges.subscribe(start => {
      if (start) {
        const startDate = new Date(start);
        const minEnd = new Date(startDate);
        minEnd.setDate(startDate.getDate() + 1);
        this.minEndDate = minEnd;
      } else {
        this.minEndDate = null;
      }
    });


  }

  onSave(): void {
    if (this.epicForm.valid) {
      this.dialogRef.close(this.epicForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }


}
