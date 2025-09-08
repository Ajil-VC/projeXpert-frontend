import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { PERMISSIONS, Roles } from '../../../../../core/domain/entities/roles.model';
import { CommonModule } from '@angular/common';
import { TeamManagementService } from '../../team-management/team-management.service';
import { NotificationService } from '../../../../../core/data/notification.service';
import { LoaderService } from '../../../../../core/data/loader.service';
import { LoaderComponent } from '../../../../../core/presentation/loader/loader.component';
import { AuthService } from '../../../../auth/data/auth.service';

@Component({
  selector: 'app-create-role-modal',
  imports: [
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,

    MatDialogContent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './create-role-modal.component.html',
  styleUrl: './create-role-modal.component.css'
})
export class CreateRoleModalComponent {

  roleForm!: FormGroup;
  permissions = PERMISSIONS;
  selectedPermissions: string[] = [];
  isAllSelected = false;
  isLoading = false;
  roleHeader: string = 'Create New Role';

  constructor(
    public dialogRef: MatDialogRef<CreateRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Roles },
    private fb: FormBuilder,
    private teamSer: TeamManagementService,
    private toast: NotificationService,
    private loader: LoaderService,
    private authSer: AuthService
  ) {

    this.initializeForm();
  }

  ngOnInit() {

    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    });
  }

  private initializeForm(): void {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      permissions: [[], Validators.required],
      description: ['']
    });

    if (this.data && this.data.role) {
      this.roleHeader = 'Edit Role';
      this.roleForm.patchValue({
        roleName: this.data.role.name,
        permissions: this.data.role.permissions,
        description: this.data.role.description
      })
    }
  }

  onCancel() {
    this.roleForm.reset();
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.loader.show();
      const formData = {
        roleName: this.roleForm.get('roleName')?.value,
        permissions: this.roleForm.get('permissions')?.value,
        description: this.roleForm.get('description')?.value || ''
      }

      this.teamSer.createOrUpdateRole(formData, this.data.role).subscribe({
        next: (res) => {
    
          if (res.status) {
            this.toast.showSuccess(res.message);
            this.dialogRef.close(res);
            this.loader.hide();
          }
        },
        error: (err) => {
          this.loader.hide();
          if (err.status === 409) {
            this.toast.showError(err.error.message);
            return;
          }
          this.toast.showError("Couldnt create new role.");
        }
      });
    }
  }

  toggleAllSelection(event: any) {
    if (event.value.includes('all')) {
      if (this.isAllSelected) {

        this.selectedPermissions = [];
      } else {

        this.selectedPermissions = [...this.permissions];
      }
      this.isAllSelected = !this.isAllSelected;
    } else {
      this.isAllSelected =
        this.permissions.length === this.selectedPermissions.length;
    }
  }

}
