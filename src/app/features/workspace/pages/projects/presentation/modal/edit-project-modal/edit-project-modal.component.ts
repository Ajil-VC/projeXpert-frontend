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
    ReactiveFormsModule
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


  constructor(
    public dialogRef: MatDialogRef<EditProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private fb: FormBuilder,
    private editProjectSer: EditProjectUseCase
  ) {

    this.setupProjectDataForView();

  }

  setupProjectDataForView(data = this.data) {

    const initData = {
      _id : data._id as string,
      name: data.name as string,
      status: data.status,
      priority: data.priority,
      members: [] as { email: string; role: 'user' | 'admin' }[]
    };
    const d = data.members as unknown;
    const mems = d as Array<User>;
    initData.members = mems.map(ele => {
      return {
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
    
      this.editProjectSer.addMember(
        this.newMemberEmail,
        this.data._id as string,
        this.data.workSpace as string
      ).subscribe({
        next: (res: { status: boolean, message: string, updatedProjectData: Project }) => {

          if (!res.status) throw new Error('Response wasnt ok');

          this.setupProjectDataForView(res.updatedProjectData);
        },
        error: (err) => {
          console.log(err, "From add members");
        }
      })
      this.newMemberEmail = '';
    }
  }

  removeMember(index: number) {
    const confirmDelete = window.confirm('Are you sure you want to remove this member?');
    if (confirmDelete) {
      const updatedMembers = [...this.data.members];
      updatedMembers.splice(index, 1);
      // this.data.members = updatedMembers;
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
