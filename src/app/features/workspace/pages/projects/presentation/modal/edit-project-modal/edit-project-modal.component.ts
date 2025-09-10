import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../../../../../core/domain/entities/project.model';
import { User } from '../../../../../../../core/domain/entities/user.model';
import { projectMember, projectView } from '../../../domain/projectView.interface';

import { EditProjectUseCase } from '../../../domain/projectEditing.domain';
import { EditProjectService } from '../../../data/edit-project.service';
import { LoaderComponent } from '../../../../../../../core/presentation/loader/loader.component';
import { NotificationService } from '../../../../../../../core/data/notification.service';
import { SharedService } from '../../../../../../../shared/services/shared.service';
import { ProjectService } from '../../../data/project.service';
import { AuthService } from '../../../../../../auth/data/auth.service';
import { TeamManagementService } from '../../../../team-management/team-management.service';
import { Roles } from '../../../../../../../core/domain/entities/roles.model';
import { Team } from '../../../../../../../core/domain/entities/team.model';
import { ConfirmDialogComponent } from '../../../../../../reusable/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-project-modal',

  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,

    LoaderComponent
  ],

  providers: [
    { provide: EditProjectUseCase, useExisting: EditProjectService }
  ],

  templateUrl: './edit-project-modal.component.html',
  styleUrl: './edit-project-modal.component.css'
})
export class EditProjectModalComponent {

  editProjectForm!: FormGroup;
  newMemberEmailControl = new FormControl('', [Validators.email]);
  newMemberEmail = '';
  selectedRole: string | null = null;
  projectData!: projectView;
  isLoading: boolean = false;

  roles: Roles[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private editProjectSer: EditProjectUseCase,
    private toast: NotificationService,
    private shared: SharedService,
    private authSer: AuthService,
    private teamSer: TeamManagementService,
    private dialog: MatDialog
  ) {

    this.setupProjectDataForView(this.data);

  }

  ngOnInit() {
    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    });

    this.teamSer.getRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve the roles.');
      }
    });

  }


  setupProjectDataForView(data: Project | null = this.data) {

    const initData = {
      _id: data?._id as string || '',
      name: data?.name as string || '',
      status: data?.status || '',
      priority: data?.priority || '',
      members: [] as { _id: string, email: string; role: Roles }[]
    };
    const d = data?.members as unknown;
    const mems = d as Array<User> || [];

    initData.members = mems.map(ele => {

      return {
        _id: ele._id,
        email: ele.email,
        role: ele.role as Roles
      };

    }).reverse();

    this.projectData = initData;

  }

  get members(): FormArray {
    return this.editProjectForm.get('members') as FormArray;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {

    this.dialogRef.close(this.projectData);
  }



  addMember() {

    if (!this.newMemberEmail) {
      this.toast.showWarning('Please provide a email.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Heads Up!!!',
        message: `Are you sure you want to Add ${this.newMemberEmail} to project ?`,
        confirmButton: 'Add User',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;

        this.editProjectSer.addMember(
          this.newMemberEmail,
          this.data._id as string,
          this.data.workSpace as string,
          this.selectedRole
        ).subscribe({
          next: (res) => {

            if (!res.status) {
              this.toast.showError('User couldnt add to the project.');
              return;
            }

            this.setupProjectDataForView(res.updatedProjectData);
            this.isLoading = false;
            this.toast.showSuccess('User added to the project.');
          },
          error: (err) => {
            this.isLoading = false;   
          }
        })
        this.newMemberEmail = '';

      }
    });

  }

  removeMember(index: number, member: projectMember) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Heads Up!!!',
        message: `Are you sure you want to remove ${member.email} from project?`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const updatedMembers: { _id: string, email: string; role: Roles }[] = [...this.projectData.members as { _id: string, email: string; role: Roles }[]];
        updatedMembers.splice(index, 1);

        if (!this.projectData._id) throw new Error('Project Id not exist');
        this.editProjectSer.removeMember(member._id, this.projectData._id).subscribe({
          next: (res) => {

            this.projectData.members = updatedMembers;
          },
          error: (err) => {
            console.error('Error occured while removing member', err);
          }
        })
      }
    });

  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
