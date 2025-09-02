import { Component, Inject } from '@angular/core';
import { LoaderComponent } from "../../../../../core/presentation/loader/loader.component";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatFormField } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../auth/data/auth.service';

@Component({
  selector: 'app-plan-creation-modal',
  imports: [LoaderComponent, MatDialogContent, MatFormField, MatLabel, MatSelect, MatOption, MatDialogActions,
    CommonModule, ReactiveFormsModule, FormsModule, MatInputModule
  ],
  templateUrl: './plan-creation-modal.component.html',
  styleUrl: './plan-creation-modal.component.css'
})
export class PlanCreationModalComponent {

  planForm: FormGroup;
  isLoading = false;

  constructor(
    private authSer: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanCreationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      billingCycle: ['', Validators.required],
      description: [''],
      maxWorkspace: [null, [Validators.required, Validators.min(0)]],
      maxProjects: [null, [Validators.required, Validators.min(0)]],
      maxMembers: [null, [Validators.required, Validators.min(0)]],
      canUseVideoCall: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.planForm.valid) {
      const newPlan = this.planForm.value;
      this.isLoading = true;

      this.dialogRef.close(newPlan);

    }
  }

}
