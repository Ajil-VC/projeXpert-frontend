import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Auth Auths': emptyProps(),
    'Auth Auths Success': props<{ data: unknown }>(),
    'Auth Auths Failure': props<{ error: unknown }>(),
  }
});
