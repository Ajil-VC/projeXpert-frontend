import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WorkspaceEffects } from './workspace.effects';

describe('WorkspaceEffects', () => {
  let actions$: Observable<any>;
  let effects: WorkspaceEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkspaceEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(WorkspaceEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
