import { ResolveFn } from '@angular/router';
import { GuardsService } from '../data/guards.service';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/data/auth.service';
import { AuthResponse } from '../../features/auth/domain/auth.domain';
import { catchError, map, of, tap } from 'rxjs';
import { NotificationService } from '../data/notification.service';

export const workspaceDataResolver: ResolveFn<boolean> = (route, state) => {

  const guardsService = inject(GuardsService);
  const authService = inject(AuthService);
  const toast = inject(NotificationService)
  return guardsService.getWorkSpaceData().pipe(
    tap((res: AuthResponse) => {
      const currentWorkSpace = res.user.defaultWorkspace;
      authService.setCurrentUser(res.user);
      authService.setCurrentWorkSpace(currentWorkSpace);
    }),
    map(() => true),
    catchError((err) => {

      toast.showError('Failed to initialize the app. Refresh the page');
      return of(true);
    })
  )
};