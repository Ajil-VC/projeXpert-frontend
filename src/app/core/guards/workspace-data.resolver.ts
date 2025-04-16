import { ResolveFn } from '@angular/router';
import { GuardsService } from '../data/guards.service';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/data/auth.service';
import { AuthResponse } from '../../features/auth/domain/auth.domain';

export const workspaceDataResolver: ResolveFn<boolean> = (route, state) => {

  const guardsService = inject(GuardsService);
  const authService = inject(AuthService);

  guardsService.getWorkSpaceData().subscribe({

    next: (res: AuthResponse) => {

      const currentWorkSpace = res.user.workSpaces.filter(ele => ele.isDefault === true);

      authService.setCurrentUser(res.user);
      authService.setCurrentWorkSpace(currentWorkSpace[0]);
    },
    error: (err) => {
      console.error("Error occured while retrieving init data.", err);
    }

  })

  return true;
};