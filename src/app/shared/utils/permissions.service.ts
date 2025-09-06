import { Injectable } from '@angular/core';
import { Permissions } from '../../core/domain/entities/roles.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private permissions: Permissions[] = [];
  constructor() {
    this.loadPermissions();
  }

  private loadPermissions() {
    const stored = localStorage.getItem('permissions');
    this.permissions = stored ? JSON.parse(stored) : [];
  }

  setPermissions(perms: Permissions[]) {
    this.permissions = perms;
    localStorage.setItem('permissions', JSON.stringify(perms));
  }

  has(required: Permissions[]): boolean {
    return required.every(p => this.permissions.includes(p));
  }

  hasAny(required: Permissions[]): boolean {
    return required.some(p => this.permissions.includes(p));
  }

  clear() {
    this.permissions = [];
    localStorage.removeItem('permissions');
  }

}
