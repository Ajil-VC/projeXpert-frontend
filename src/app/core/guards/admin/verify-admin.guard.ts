import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GuardsService } from '../../data/guards.service';
import { catchError, map, of } from 'rxjs';


export const verifyAdminGuard: CanActivateFn = (route, state) => {

  const guardService = inject(GuardsService);
  const router = inject(Router);

  const token = localStorage.getItem('authToken');

  if (!token) {
    router.navigate(['/admin/login']);
    return of(false);
  }

  return guardService.autherizeAdmin().pipe(
    map((res) => {
      const result = res as { status: boolean, user: any };
      return result.status && result.user?.systemRole === 'platform-admin';
    }),
    catchError(() => {
      // Optional: redirect to forbidden page or login
      localStorage.removeItem('authToken');
      router.navigate(['/admin/login']);
      return of(false);
    })
  );
};
