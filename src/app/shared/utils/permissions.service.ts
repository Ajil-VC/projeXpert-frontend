import { Injectable } from '@angular/core';
import { Permissions, Roles } from '../../core/domain/entities/roles.model';
import { GuardsService } from '../../core/data/guards.service';
import { AuthService } from '../../features/auth/data/auth.service';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private permissions: Permissions[] = [];
  constructor(private guardSer: GuardsService, private sharedSer: SharedService) {
    this.loadPermissions();
  }

  private loadPermissions() {
    const stored = localStorage.getItem('permissions');
    this.permissions = stored ? JSON.parse(stored) : [];

  }

  resetPermissions() {
    this.guardSer.authenticateUser().subscribe({
      next: (res) => {
        if (res.status) {
          this.setPermissions((res.user.role as Roles).permissions);
          this.sharedSer.reloadPage();
        }
      }
    })
  }

  setPermissions(perms: Permissions[]) {
    this.clear();
    this.permissions = perms;
    localStorage.setItem('permissions', JSON.stringify(perms));
    this.loadPermissions();
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
