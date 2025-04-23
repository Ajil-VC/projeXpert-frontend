import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Workspace } from '../../../../../../../core/domain/entities/workspace.model';
import { Project } from '../../../../../../../core/domain/entities/project.model';
import { User } from '../../../../../../../core/domain/entities/user.model';
import { projectView } from '../../../domain/projectView.interface';

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
    CommonModule
  ],

  templateUrl: './edit-project-modal.component.html',
  styleUrl: './edit-project-modal.component.css'
})
export class EditProjectModalComponent {

  constructor(
    public dialogRef: MatDialogRef<EditProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {

    console.log(data, "MOda");
    this.projectData.name = data.name as string;
    this.projectData.status = data.status;
    this.projectData.priority = data.priority;
    const d = data.members as unknown;
    const mems = d as Array<User>;
    this.projectData.members = mems.map(ele => {
      return {
        email: ele.email,
        role: ele.role === 'admin' || ele.role === 'user' ? ele.role : 'user'
      }
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }


  newMemberEmail = '';
  projectData: projectView = {
    name: '',
    status: '',
    priority: '',
    members: []
  };

  addMember() {
    if (this.newMemberEmail) {
      // this.data.members.push({ email: this.newMemberEmail, role: 'viewer' });
      this.newMemberEmail = '';
    }
  }

  removeMember(index: number) {
    const confirmDelete = window.confirm('Are you sure you want to remove this member?');
    if (confirmDelete) {
      const updatedMembers = [...this.data.members];
      updatedMembers.splice(index, 1);
      this.data.members = updatedMembers;
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
