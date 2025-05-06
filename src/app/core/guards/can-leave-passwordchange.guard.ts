import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../domain/entities/canCompoDecativate';

export const canLeavePasswordchangeGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {

  return component.canDeactivate();

};
