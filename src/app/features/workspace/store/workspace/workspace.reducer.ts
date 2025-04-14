import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Workspace } from './workspace.model';
import { WorkspaceActions } from './workspace.actions';

export const workspacesFeatureKey = 'workspaces';

export interface State extends EntityState<Workspace> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Workspace> = createEntityAdapter<Workspace>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(WorkspaceActions.addWorkspace,
    (state, action) => adapter.addOne(action.workspace, state)
  ),
  on(WorkspaceActions.upsertWorkspace,
    (state, action) => adapter.upsertOne(action.workspace, state)
  ),
  on(WorkspaceActions.addWorkspaces,
    (state, action) => adapter.addMany(action.workspaces, state)
  ),
  on(WorkspaceActions.upsertWorkspaces,
    (state, action) => adapter.upsertMany(action.workspaces, state)
  ),
  on(WorkspaceActions.updateWorkspace,
    (state, action) => adapter.updateOne(action.workspace, state)
  ),
  on(WorkspaceActions.updateWorkspaces,
    (state, action) => adapter.updateMany(action.workspaces, state)
  ),
  on(WorkspaceActions.deleteWorkspace,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(WorkspaceActions.deleteWorkspaces,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(WorkspaceActions.loadWorkspaces,
    (state, action) => adapter.setAll(action.workspaces, state)
  ),
  on(WorkspaceActions.clearWorkspaces,
    state => adapter.removeAll(state)
  ),
);

export const workspacesFeature = createFeature({
  name: workspacesFeatureKey,
  reducer,
  extraSelectors: ({ selectWorkspacesState }) => ({
    ...adapter.getSelectors(selectWorkspacesState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = workspacesFeature;
