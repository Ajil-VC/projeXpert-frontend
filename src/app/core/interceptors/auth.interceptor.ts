import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/data/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('authToken');
  const router = inject(Router);

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

      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        // Try refreshing the token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new access token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            return next(newReq);
          }),
          catchError(refreshError => {
            // Refresh token is also invalid → logout
            authService.logout(); // clear tokens, redirect to login, etc.
            return throwError(refreshError);
          })
        );
      } else if (error.status === 403) {
        //show up message telling “You don’t have permission to access this page.”
        // router.navigate(['forbidden']);
      }

      return throwError(() => error);
    })
  );

};
