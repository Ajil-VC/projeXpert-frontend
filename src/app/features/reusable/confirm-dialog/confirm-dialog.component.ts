import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../auth/data/auth.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent implements OnInit {
  private authSer = inject(AuthService);
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
}>(MAT_DIALOG_DATA);


  ngOnInit() {
    this.authSer.logout$.subscribe({
      next: () => this.dialogRef.close(null)
    })
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
