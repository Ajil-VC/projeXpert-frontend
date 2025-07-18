import { ResolveFn } from '@angular/router';
import { GuardsService } from '../../data/guards.service';
import { inject } from '@angular/core';
import { AuthService } from '../../../features/auth/data/auth.service';
import { catchError, map, of, tap } from 'rxjs';
import { NotificationService } from '../../data/notification.service';

export const adminResolver: ResolveFn<boolean> = (route, state) => {

  const guardService = inject(GuardsService);
  const authService = inject(AuthService);
  const toast = inject(NotificationService);

  return guardService.adminData().pipe(
    tap((res: any) => {

      if (res.status) {

        authService.setCurrentUser(res.result);
      }

    }),
    map(() => true),
    catchError((err) => {
      toast.showError('Failed to set admin details. Refresh the page');
      return of(false);
    })
  )

};
