import { CanActivateFn } from '@angular/router';

export const loginGuardGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('authToken');
  if (!token) return true;
  return false;
  
};
