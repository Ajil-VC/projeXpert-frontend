import { ResolveFn } from '@angular/router';
import { GuardsService } from '../data/guards.service';
import { inject } from '@angular/core';

export const workspaceDataResolver: ResolveFn<boolean> = (route, state) => {

  const guardsService = inject(GuardsService);

  guardsService.getWorkSpaceData().subscribe({

    next: (res) => {

    },
    error: (err) => {
      console.error("Error occured while retrieving init data.", err);
    }

  })

  return true;
};