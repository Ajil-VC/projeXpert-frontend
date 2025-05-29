import { Component } from '@angular/core';
import { Project } from '../../../../core/domain/entities/project.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsUseCase } from '../../pages/projects/domain/projects.domain';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../shared/services/layout.service';
import { Company } from '../../../../core/domain/entities/company.model';
import { CommonModule } from '@angular/common';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-workspace',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatError,
    MatInputModule
  ],
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.css'
})
export class CreateWorkspaceComponent {


  workspaceForm!: FormGroup;
  isButtonDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateWorkspaceComponent>
  ) {

    this.workspaceForm = this.fb.group({
      workspaceName: ['', Validators.required]
    })
  }


  onSave(): void {
    if (this.workspaceForm.valid) {
      this.dialogRef.close(this.workspaceForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }


}
