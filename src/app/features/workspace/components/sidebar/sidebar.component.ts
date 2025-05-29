import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/data/auth.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { Project } from '../../../../core/domain/entities/project.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { User } from '../../../../core/domain/entities/user.model';


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

  public currentProject: string = '';

  constructor(private authSer: AuthService, private shared: SharedService) {

  }

  ngOnInit() {

    this.shared.currentPro$.subscribe({
      next: (res: any) => {
        this.currentProject = (res as Project).name as string;
      },
      error: (err) => {
        console.log('Error occured while getting current project', err);
      }
    });

    this.authSer.user$.subscribe({
      next: (res:User | null) => {
        if(res){

          if (res.role !== 'admin') {
            this.menuItems = this.menuItems.filter(item => (item.id !== 'projects' && item.id !== 'backlog'));
          }
        }

      }
    })
  }

  menuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/user/dashboard', active: false },
    { id: 'backlog', icon: 'fa-list', label: 'Backlog', route: '/user/backlog', active: false },
    { id: 'board', icon: 'fa-columns', label: 'Board', route: '/user/board', active: false },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', active: false },
    { id: 'chat', icon: 'fa-comment', label: 'Chat', route: '/chat', active: false },
    { id: 'meeting', icon: 'fa-video', label: 'Meeting', route: '/meeting', active: false },
    { id: 'teams', icon: 'fa-users', label: 'Teams & Members', route: '/teams-members', active: false },
    { id: 'projects', icon: 'fa-folder', label: 'Projects', route: '/user/project-info', active: false },
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
