import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFlowService } from '../../features/auth/data/auth.service';

export const otpGuard: CanActivateFn = (route, state) => {

  const flowService = inject(AuthFlowService)
  const router = inject(Router);

  if (flowService.getEmail()) {
    return true;
  }

  router.navigate(['']);
  return false;
};
