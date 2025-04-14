import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { ProjectsActions } from './projects.actions';


@Injectable()
export class ProjectsEffects {

  projectProjectss$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(ProjectsActions.projectProjectss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => ProjectsActions.projectProjectssSuccess({ data })),
          catchError(error => of(ProjectsActions.projectProjectssFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
