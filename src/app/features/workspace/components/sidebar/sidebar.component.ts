import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


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


  menuItems: MenuItem[] = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard', route: '/user/dashboard', active: false },
    { id: 'backlog', icon: 'fa-list', label: 'Backlog', route: '/backlog', active: false },
    { id: 'board', icon: 'fa-columns', label: 'Board', route: '/board', active: false },
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
