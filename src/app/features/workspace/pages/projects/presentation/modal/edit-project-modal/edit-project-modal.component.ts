import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../../../../../core/domain/entities/project.model';
import { User } from '../../../../../../../core/domain/entities/user.model';
import { projectView } from '../../../domain/projectView.interface';
import { EditProjectUseCase } from '../../../domain/projectEditing.domain';
import { EditProjectService } from '../../../data/edit-project.service';
import { LoaderComponent } from '../../../../../../../core/presentation/loader/loader.component';
import { NotificationService } from '../../../../../../../core/data/notification.service';
import { SharedService } from '../../../../../../../shared/services/shared.service';

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
  projectData!: projectView;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private editProjectSer: EditProjectUseCase,
    private toast: NotificationService,
    private shared: SharedService
  ) {

    this.setupProjectDataForView();

  }

  ngOnInit() {
    this.shared.currentPro$.subscribe((project) => {

      this.setupProjectDataForView(project);

    })
  }

  setupProjectDataForView(data: Project | null = this.data) {

    const initData = {
      _id: data?._id as string || '',
      name: data?.name as string || '',
      status: data?.status || '',
      priority: data?.priority || '',
      members: [] as { _id: string, email: string; role: 'user' | 'admin' }[]
    };
    const d = data?.members as unknown;
    const mems = d as Array<User> || [];


    initData.members = mems.map(ele => {
      return {
        _id: ele._id,
        email: ele.email,
        role: (ele.role === 'admin' || ele.role === 'user') ? ele.role as 'admin' | 'user' : 'user'
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

    const confirmAdd = window.confirm('Please ensure the email');

    if (this.newMemberEmail && confirmAdd) {
      this.isLoading = true;

      this.editProjectSer.addMember(
        this.newMemberEmail,
        this.data._id as string,
        this.data.workSpace as string
      ).subscribe({
        next: (res: { status: boolean, message: string, updatedProjectData: Project }) => {

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
          this.toast.showError('User couldnt add to the project.');
        }
      })
      this.newMemberEmail = '';
    }
  }

  async removeMember(index: number, userId: string) {

    const confirmDelete = await window.confirm('Are you sure you want to remove this member?');
    if (confirmDelete) {

      const updatedMembers: { _id: string, email: string; role: 'user' | 'admin' }[] = [...this.projectData.members as { _id: string, email: string; role: 'user' | 'admin' }[]];
      updatedMembers.splice(index, 1);

      if (!this.projectData._id) throw new Error('Project Id not exist');
      this.editProjectSer.removeMember(userId, this.projectData._id).subscribe({
        next: (res) => {

          this.projectData.members = updatedMembers;
        },
        error: (err) => {
          console.error('Error occured while removing member', err);
        }
      })

    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
