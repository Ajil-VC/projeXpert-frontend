import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verifyAdminGuard } from './verify-admin.guard';

describe('verifyAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verifyAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
