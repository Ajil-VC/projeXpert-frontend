import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../../../core/domain/entities/company.model';
import { User } from '../../../../../core/domain/entities/user.model';
import { MatInput } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { AdminService } from '../../../data/admin.service';
import { SearchPipe } from '../../../../../core/pipes/search.pipe';
import { AuthService } from '../../../../auth/data/auth.service';

@Component({
  selector: 'app-edit-company-modal',
  imports: [
    FormsModule,
    CommonModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatInput,
    MatSlideToggleModule,
    MatSelectModule,
    MatButton,
    SearchPipe
  ],
  templateUrl: './edit-company-modal.component.html',
  styleUrl: './edit-company-modal.component.css'
})
export class EditCompanyModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<EditCompanyModalComponent>>(MatDialogRef);
  data = inject<{
    companyDetails: Company;
    companyId: string;
    users: User[];
}>(MAT_DIALOG_DATA);
  private adminService = inject(AdminService);
  private authSer = inject(AuthService);


  userSearchTerm = '';
  editCompanyForm!: FormGroup;
  newMemberEmailControl = new FormControl('', [Validators.email]);

  removeUser(i: any, userId: any) { }

  ngOnInit() {
    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {

    // this.dialogRef.close(this.projectData);
  }

  onCompanyToggle(company: Company) {

    this.adminService.blockOrUnblockCompany(company._id, company.isBlocked).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error occured while changing company status.', err);
      }
    })
  }

  onUserBlockToggle(user: User, i: any) {

    this.adminService.blockOrUnblockUser(user._id, user.isBlocked).subscribe({
      next: (res) => {
        console.log(res, 'res');
      },
      error: (err) => {
        console.error('Error occured while changing user status.');
      }
    })
  }

  trackByIndex(index: number): number {
    return index;
  }
}
