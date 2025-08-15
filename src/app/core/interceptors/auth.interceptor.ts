import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/data/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../data/notification.service';




export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const router = inject(Router);
  const injector = inject(Injector);

  let cloneReq = req;
  if (token) {
    cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const authService = inject(AuthService);

  return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const notificationService = injector.get(NotificationService);
      let userFriendlyMessage = 'An unexpected error occurred. Please try again later.';

      if (error.status === 0) {
        // No response from server
        userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection.';
        notificationService.showError(userFriendlyMessage);

      } else if (error.status === 401 && !req.url.includes('/refresh-token')) {
        // Try refreshing the token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new access token
            const newReq = cloneReq.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            return next(newReq);
          }),
          catchError(refreshError => {
            // Refresh token is also invalid => logout and clear everything
            authService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      } else if (error.status === 403) {
        console.log(error)
        if (error.error['issue']) {
          notificationService.showInfo(error.error['message']);
          return throwError(() => error);
        }
        if (error.error && error.error['message']) {
          const msg1 = 'Please subscribe to a plan to perform this operation';
          const msg2 = 'Dont have permission to perform this operation';
          const msg3 = 'Please subscribe to a plan to add more members';

          if (error.error['message'] === msg3) {

            return throwError(() => error);
          }

          if (error.error['message'] === msg1 || error.error['message'] === msg2) {
            notificationService.showError(error.error['message']);
            return of();
          }
        }

        authService.logout();

        if (error.error && error.error['message'] && (error.error['message'] === 'Company blocked' || error.error['message'] === 'User account is blocked.')) {
          router.navigate(['forbidden'], {
            state: {
              message: `${error.error['message']}`,
              code: 'COMPANY_BLOCKED'
            }
          });
        } else {
          userFriendlyMessage = "You don't have permission to access this page.";
          notificationService.showError("You don't have permission to access this page.");
          router.navigate(['forbidden'], {
            state: {
              message: userFriendlyMessage,
              code: 'PERMISSION_DENIED'
            }
          });
        }
      } else if (error.status === 404 || error.status === 400) {
        userFriendlyMessage = error.error?.message || 'Something went wrong. Please try again.';
        notificationService.showError(userFriendlyMessage);
      } else if (error.status === 409) {
        return throwError(() => error);
      } else if (error.status >= 500) {
        userFriendlyMessage = 'Server error. Please try again later.';
        notificationService.showError(userFriendlyMessage);
      }

      return throwError(() => new Error(userFriendlyMessage));
    })
  );
};