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

interface MenuItem {
  id: string,
  icon: string,
  label: string,
  route: string,
  active: boolean
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
    private loadSer: LoaderService
  ) {

  }

  isPlatformAdmin() {
    return this.systemRole === 'platform-admin';
  }

  ngOnInit() {

    this.menuItems = this.isPlatformAdmin() ? this.adminMenuItems : this.userMenuItems;

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

      this.authSer.user$.subscribe({
        next: (res: User | null) => {
          if (res) {

            if (res.role !== 'admin') {
              this.menuItems = this.menuItems.filter(item => (item.id !== 'projects' && item.id !== 'backlog' && item.id !== 'subscription' && item.id !== 'teams'));
            }
          }

        }
      });
    }
  }

  userMenuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/user/dashboard', active: false },
    { id: 'backlog', icon: 'fa-list', label: 'Backlog', route: '/user/backlog', active: false },
    { id: 'board', icon: 'fa-columns', label: 'Board', route: '/user/board', active: false },
    // { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', active: false },
    { id: 'chat', icon: 'fa-comment', label: 'Chat', route: '/user/chat', active: false },
    { id: 'meeting', icon: 'fa-video', label: 'Meeting', route: '/user/meeting', active: false },
    { id: 'projects', icon: 'fa-folder', label: 'Projects', route: '/user/project-info', active: false },
    { id: 'teams', icon: 'fa-users', label: 'Teams & Members', route: '/user/teams-members', active: false },
    { id: 'subscription', icon: 'fa-rocket', label: 'Subscription', route: '/user/subscription', active: false },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/user/settings', active: false }
  ];

  adminMenuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/admin/dashboard', active: false },
    { id: 'companies', icon: 'fa-building', label: 'Companies', route: '/admin/companies', active: false },
    // { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', active: false },
    { id: 'create-plan', icon: '	fa-tools', label: 'Create plan', route: '/admin/create-plan', active: false },
    { id: 'subscription', icon: 'fa-coins', label: 'Subscription', route: '/admin/subscription', active: false },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/admin/settings', active: false }
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
