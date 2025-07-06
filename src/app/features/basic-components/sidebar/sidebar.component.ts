import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/data/auth.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { Project } from '../../../core/domain/entities/project.model';
import { SharedService } from '../../../shared/services/shared.service';
import { User } from '../../../core/domain/entities/user.model';
import { NotificationService } from '../../../core/data/notification.service';

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
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() systemRole!: string;
  public currentProject: string = '';
  menuItems: MenuItem[] = [];

  constructor(private authSer: AuthService, private shared: SharedService, private toast: NotificationService) {

  }

  isPlatformAdmin() {
    return this.systemRole === 'platform-admin';
  }

  ngOnInit() {

    this.menuItems = this.isPlatformAdmin() ? this.adminMenuItems : this.userMenuItems;

    if (!this.isPlatformAdmin()) {

      this.shared.currentPro$.subscribe({
        next: (res: any) => {
          if (res) {

            this.currentProject = (res as Project).name as string;
          }
          return;
        },
        error: (err) => {
          this.toast.showError('Failed to load current project. Please try again by refreshing')
        }
      });

      this.authSer.user$.subscribe({
        next: (res: User | null) => {
          if (res) {

            if (res.role !== 'admin') {
              this.menuItems = this.menuItems.filter(item => (item.id !== 'projects' && item.id !== 'backlog'));
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
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', active: false },
    { id: 'chat', icon: 'fa-comment', label: 'Chat', route: '/user/chat', active: false },
    { id: 'meeting', icon: 'fa-video', label: 'Meeting', route: '/meeting', active: false },
    { id: 'teams', icon: 'fa-users', label: 'Teams & Members', route: '/teams-members', active: false },
    { id: 'projects', icon: 'fa-folder', label: 'Projects', route: '/user/project-info', active: false },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/settings', active: false }
  ];

  adminMenuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/admin/dashboard', active: false },
    { id: 'companies', icon: 'fa-building', label: 'Companies', route: '/admin/companies', active: false },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', active: false },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/settings', active: false }
  ];

  isCollapsed = false;
  isMobileMenuOpen = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


  setActiveItem(item: MenuItem) {

    this.menuItems.forEach(menuItem => {
      menuItem.active = menuItem.id === item.id;
    });
  }


}
