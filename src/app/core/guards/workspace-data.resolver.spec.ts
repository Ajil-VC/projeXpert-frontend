import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { workspaceDataResolver } from './workspace-data.resolver';

describe('workspaceDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => workspaceDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
