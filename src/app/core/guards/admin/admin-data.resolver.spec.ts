import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { adminDataResolver } from './admin-data.resolver';

describe('adminDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => adminDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
