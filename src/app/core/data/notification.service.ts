import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastr = inject(ToastrService);


  showError(message: string, title = 'Error') {
    this.toastr.error(message, title);
  }

  showSuccess(message: string, title = 'Success') {
    this.toastr.success(message, title);
  }

  showWarning(message: string, title = 'Warning') {
    this.toastr.warning(message, title);
  }

  showInfo(message: string, title = 'Info') {
    this.toastr.info(message, title);
  }

}
