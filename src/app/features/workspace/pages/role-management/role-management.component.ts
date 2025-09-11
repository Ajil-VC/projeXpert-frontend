import { Component } from '@angular/core';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { CreateRoleModalComponent } from './create-role-modal/create-role-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from '../../../../core/domain/entities/roles.model';
import { TeamManagementService } from '../team-management/team-management.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';
import { ConfirmDialogComponent } from '../../../reusable/confirm-dialog/confirm-dialog.component';
import { PermissionsService } from '../../../../shared/utils/permissions.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { HaspermissionDirective } from '../../../../core/directives/haspermission.directive';

@Component({
  selector: 'app-role-management',
  imports: [ContentHeaderComponent, CommonModule, LoaderComponent, HaspermissionDirective],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {

  headerConfig: HeaderConfig = {

    title: 'Role Management',
    icon: '🛡️',
    subtitle: 'Manage roles here.',
    placeHolder: 'Search roles and permissions...',
    hideSearchBar: false,
    searchQuery: '',
    buttons: [
      {
        type: 'main',
        label: '+ Create Role',
      },
      { type: 'view' }
    ]

  }
  setHeaderViewPermissions() {
    this.headerConfig.hideSearchBar = !this.permission.hasAny(['assign_role']);
    if (this.headerConfig?.buttons) {
      for (let btn of this.headerConfig.buttons) {
        if (btn.type === 'main') {
          btn.restriction = !this.permission.has(['assign_role']);
        } else if (btn.type === 'filter' || btn.type === 'view') {
          btn.restriction = !this.permission.has(['assign_role']);
        }
      }
    }
  }
  handleSearchEvent(event: string) {

    this.searchTerm = event;
    const regex = new RegExp(this.escapeRegex(this.searchTerm), 'i');
    this.filteredRoles = this.roles.filter(r => {
      if (!this.searchTerm) {
        return true;
      }

      return regex.test(r.name) || r.permissions.some(p => regex.test(p));
    })

  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {
        this.createOrUpdateRole();
      } else if (btn.type === 'filter') {
        if (btn.action && 'statusFilters' in btn.action) {
          // this.toggleStatusFilter(btn.action.statusFilters)
        }
      } else if (btn.type === 'view') {
        if (btn.action && 'viewMode' in btn.action && btn.action.viewMode) {
          this.viewMode = btn.action.viewMode;
        }
      }
    }
  }


  private escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  searchTerm: string = '';
  roles: Roles[] = [];
  isLoading: boolean = false;
  viewMode: 'grid' | 'list' = 'grid';
  filteredRoles: Roles[] = [];

  constructor(
    private dialog: MatDialog,
    private teamSer: TeamManagementService,
    private toast: NotificationService,
    private permission: PermissionsService,
    private shared: SharedService
  ) { }
  ngOnInit() {
    this.teamSer.getRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
        this.filteredRoles = this.roles;
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve the roles.');
      }
    });

    this.shared.reload$.subscribe({
      next: (res) => {
        this.setHeaderViewPermissions();
        if (!this.permission.has(['assign_role'])) {
          this.roles = [];
          this.filteredRoles = [];
        }
      }
    })
  }

  createOrUpdateRole(event?: Event, role: Roles | null = null) {
    event?.stopPropagation();

    const dialogRef = this.dialog.open(CreateRoleModalComponent, {
      width: '500px',
      data: { role: role }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.status && res?.updated) {

        const index = this.roles.findIndex(r => r._id === res.result._id);
        this.roles[index] = res.result;
        this.filteredRoles = this.roles;

      } else if (res?.status) {
        this.roles.push(res.result);
        this.filteredRoles = this.roles;
      }
    });
  }


  deleteRole(event: Event, role: Roles) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Heads Up!!!',
        message: `Are you sure you want to delete ${role.name}? This action cannot be undone.`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamSer.deleteRole(role._id).subscribe({
          next: (res) => {
            if (res?.status) {
              const index = this.roles.findIndex(r => r._id === role._id);
              this.roles.splice(index, 1);
              this.filteredRoles = this.roles;
              this.toast.showSuccess(res.message);
            }
          }
        })
      }
    });
  }

}
