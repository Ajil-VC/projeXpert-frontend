import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GuardsService } from '../../data/guards.service';
import { catchError, map, of } from 'rxjs';

export const adminDataResolver: ResolveFn<any> = (route, state) => {

  const guardService = inject(GuardsService);

  return guardService.getCompanydataForPlatformAdmin().pipe(
    catchError((error) => {
      console.error('Error occurred while getting company data.', error);
      return of(null); 
    })
  );

};
