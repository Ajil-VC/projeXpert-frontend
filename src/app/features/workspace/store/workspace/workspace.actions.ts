import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Workspace } from './workspace.model';

export const WorkspaceActions = createActionGroup({
  source: 'Workspace/API',
  events: {
    'Load Workspaces': props<{ workspaces: Workspace[] }>(),
    'Add Workspace': props<{ workspace: Workspace }>(),
    'Upsert Workspace': props<{ workspace: Workspace }>(),
    'Add Workspaces': props<{ workspaces: Workspace[] }>(),
    'Upsert Workspaces': props<{ workspaces: Workspace[] }>(),
    'Update Workspace': props<{ workspace: Update<Workspace> }>(),
    'Update Workspaces': props<{ workspaces: Update<Workspace>[] }>(),
    'Delete Workspace': props<{ id: string }>(),
    'Delete Workspaces': props<{ ids: string[] }>(),
    'Clear Workspaces': emptyProps(),
  }
});
