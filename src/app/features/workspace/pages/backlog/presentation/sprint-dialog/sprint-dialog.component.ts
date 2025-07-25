import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-sprint-dialog',
  imports: [ReactiveFormsModule, FormsModule,
    CommonModule, MatDialogContent, MatFormField, MatLabel,
    MatDatepickerModule, MatDialogActions, MatHint, MatError, MatInputModule],
  templateUrl: './sprint-dialog.component.html',
  styleUrl: './sprint-dialog.component.css'
})
export class SprintDialogComponent {

  sprintForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SprintDialogComponent>
  ) {
    this.sprintForm = this.fb.group({
      sprintName: [''],
      duration: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required]
    });
  }

  onSave(): void {
    if (this.sprintForm.valid) {
      this.dialogRef.close(this.sprintForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

}
