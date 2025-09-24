import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../auth/data/auth.service';


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
    public dialogRef: MatDialogRef<SprintDialogComponent>,
    private authSer: AuthService
  ) {
    this.sprintForm = this.fb.group({
      sprintName: [''],
      sprintGoal: ['', [Validators.required, this.noWhitespaceValidator()]],
      duration: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }

  onSave(): void {
    if (this.sprintForm.valid) {
      this.dialogRef.close(this.sprintForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

}
