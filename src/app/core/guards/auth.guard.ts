import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { GuardsService } from '../data/guards.service';

export const authGuard: CanActivateFn = (route, state) => {

  const guardService = inject(GuardsService);
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }

  return guardService.authenticateUser().pipe(
    map((res) => {

      return res.status && res.user.systemRole === 'company-user';
    }),
    catchError(() => {
      // Optional: redirect to forbidden page or login
      localStorage.removeItem('authToken');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
