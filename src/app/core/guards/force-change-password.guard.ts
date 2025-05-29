import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/data/auth.service';

export const forceChangePasswordGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
// console.log(user,'This is user');
//   if(user?.forceChangePassword){
//     return router.createUrlTree(['/change-password']);
//   }

  authService.user$.subscribe({
    next: (res) => {
      console.log(res,'This isres')
      if (res && res.forceChangePassword) {
        router.navigate(['user/change-password']);
        return;
      }
    },
    error: (err) => {
      console.log("Somethingwent wrong", err);
    }
  })

  return true;
};
