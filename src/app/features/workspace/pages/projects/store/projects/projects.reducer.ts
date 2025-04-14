import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Projects } from './projects.model';
import { ProjectsActions } from './projects.actions';

export const projectsesFeatureKey = 'projectses';

export interface State extends EntityState<Projects> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Projects> = createEntityAdapter<Projects>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(ProjectsActions.addProjects,
    (state, action) => adapter.addOne(action.projects, state)
  ),
  on(ProjectsActions.upsertProjects,
    (state, action) => adapter.upsertOne(action.projects, state)
  ),
  on(ProjectsActions.addProjectss,
    (state, action) => adapter.addMany(action.projectss, state)
  ),
  on(ProjectsActions.upsertProjectss,
    (state, action) => adapter.upsertMany(action.projectss, state)
  ),
  on(ProjectsActions.updateProjects,
    (state, action) => adapter.updateOne(action.projects, state)
  ),
  on(ProjectsActions.updateProjectss,
    (state, action) => adapter.updateMany(action.projectss, state)
  ),
  on(ProjectsActions.deleteProjects,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ProjectsActions.deleteProjectss,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ProjectsActions.loadProjectss,
    (state, action) => adapter.setAll(action.projectss, state)
  ),
  on(ProjectsActions.clearProjectss,
    state => adapter.removeAll(state)
  ),
);

export const projectsesFeature = createFeature({
  name: projectsesFeatureKey,
  reducer,
  extraSelectors: ({ selectProjectsesState }) => ({
    ...adapter.getSelectors(selectProjectsesState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = projectsesFeature;
