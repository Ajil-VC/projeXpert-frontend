import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Projects } from './projects.model';

export const ProjectsActions = createActionGroup({
  source: 'Projects/API',
  events: {
    'Load Projectss': props<{ projectss: Projects[] }>(),
    'Add Projects': props<{ projects: Projects }>(),
    'Upsert Projects': props<{ projects: Projects }>(),
    'Add Projectss': props<{ projectss: Projects[] }>(),
    'Upsert Projectss': props<{ projectss: Projects[] }>(),
    'Update Projects': props<{ projects: Update<Projects> }>(),
    'Update Projectss': props<{ projectss: Update<Projects>[] }>(),
    'Delete Projects': props<{ id: string }>(),
    'Delete Projectss': props<{ ids: string[] }>(),
    'Clear Projectss': emptyProps(),
  }
});
