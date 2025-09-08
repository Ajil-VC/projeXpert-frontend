import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/data/auth.service';
import { Project } from '../../../core/domain/entities/project.model';
import { SharedService } from '../../../shared/services/shared.service';
import { User } from '../../../core/domain/entities/user.model';
import { NotificationService } from '../../../core/data/notification.service';
import { ProjectDataService } from '../../../shared/services/project-data.service';

import { LoaderService } from '../../../core/data/loader.service';
import { PermissionsService } from '../../../shared/utils/permissions.service';
import { Permissions } from '../../../core/domain/entities/roles.model';

interface MenuItem {
  id: string,
  icon: string,
  label: string,
  route: string,
  active: boolean,
  required?: Permissions[]
}


@Component({

  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',

})
export class SidebarComponent {

  @Input() systemRole!: string;
  public currentProjectName: string = '';
  private currentProject!: Project;
  menuItems: MenuItem[] = [];
  isProjectSelected!: boolean;
  @Output() response = new EventEmitter();

  constructor(
    private authSer: AuthService,
    private shared: SharedService,
    private toast: NotificationService,
    private projSer: ProjectDataService,
    private loadSer: LoaderService,
    private permission: PermissionsService
  ) {

  }

  isPlatformAdmin() {
    return this.systemRole === 'platform-admin';
  }

  ngOnInit() {

    this.menuItems = this.isPlatformAdmin() ? this.adminMenuItems :
      this.userMenuItems.filter(item => !item.required || this.permission.hasAny(item.required))

    if (!this.isPlatformAdmin()) {

      this.shared.currentPro$.subscribe({
        next: (res: any) => {
          if (!res) {
            this.currentProjectName = 'Select a project';
            this.isProjectSelected = false;
            return;
          }
          this.currentProject = res as Project;
          this.currentProjectName = (res as Project).name as string;
          this.isProjectSelected = true;
          return;
        },
        error: (err) => {
          this.toast.showError('Failed to load current project. Please try again by refreshing')
        }
      });

      this.projSer.delProject$.subscribe({
        next: (res) => {
          if (res._id === this.currentProject._id) {

            this.currentProjectName = 'Select a project';
            this.isProjectSelected = false;
          }
        }
      })

    }
  }

  userMenuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/user/dashboard', active: false },
    { id: 'backlog', icon: 'fa-list', label: 'Backlog', route: '/user/backlog', active: false, required: ['view_sprint'] },
    { id: 'board', icon: 'fa-columns', label: 'Board', route: '/user/board', active: false, required: ['view_task', 'view_project', 'view_all_task'] },
    { id: 'chat', icon: 'fa-comment', label: 'Chat', route: '/user/chat', active: false },
    { id: 'meeting', icon: 'fa-video', label: 'Meeting', route: '/user/meeting', active: false },
    { id: 'projects', icon: 'fa-folder', label: 'Projects', route: '/user/project-info', active: false, required: ['view_project', 'invite_user'] },
    { id: 'teams', icon: 'fa-users', label: 'Users', route: '/user/teams-members', active: false, required: ['assign_role'] },
    { id: 'roles', icon: 'fa-user-cog', label: 'Roles', route: '/user/roles', active: false, required: ['assign_role'] },
    { id: 'subscription', icon: 'fa-rocket', label: 'Subscription', route: '/user/subscription', active: false, required: ['manage_billing'] },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/user/settings', active: false }
  ];

  adminMenuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/admin/dashboard', active: false },
    { id: 'companies', icon: 'fa-building', label: 'Companies', route: '/admin/companies', active: false },
    { id: 'create-plan', icon: '	fa-tools', label: 'Create plan', route: '/admin/create-plan', active: false },
    { id: 'revenue', icon: 'fa-solid fa-chart-line', label: 'Revenue report', route: '/admin/revenue', active: false },
    { id: 'subscription', icon: 'fa-coins', label: 'Subscriptions', route: '/admin/subscription', active: false },
    { id: 'profile', icon: 'fa-cog', label: 'Profile settings', route: '/admin/settings', active: false }
  ];

  isCollapsed = false;
  isMobileMenuOpen = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.response.emit(this.isCollapsed);
    this.loadSer.changeValue(this.isCollapsed);
  }


  setActiveItem(item: MenuItem) {

    this.menuItems.forEach(menuItem => {
      menuItem.active = menuItem.id === item.id;
    });
  }


}
