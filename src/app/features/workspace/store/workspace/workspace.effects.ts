import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { WorkspaceActions } from './workspace.actions';


@Injectable()
export class WorkspaceEffects {

  workspaceWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(WorkspaceActions.workspaceWorkspaces),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => WorkspaceActions.workspaceWorkspacesSuccess({ data })),
          catchError(error => of(WorkspaceActions.workspaceWorkspacesFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
