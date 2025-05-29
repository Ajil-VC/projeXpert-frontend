import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

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


  return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401)) {
        localStorage.removeItem('authToken');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );

};
