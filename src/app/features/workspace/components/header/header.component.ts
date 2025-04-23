import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../auth/data/auth.service';
import { User } from '../../../../core/domain/entities/user.model';
import { Workspace } from '../../../../core/domain/entities/workspace.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {


  showWorkspaceMenu = false;
  showUserMenu = false;
  isMobileMenuOpen = false;

  currentUser!: User | null;
  currentWorkspace!: Workspace | null;

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {

    this.authService.user$.subscribe({
      next: (res) => {

        this.currentUser = res

      },
      error: (err) => {
        console.error('Error Occured while populating user data into header.', err);
      }
    });

    this.authService.workSpace$.subscribe({
      next: (res) => {

        this.currentWorkspace = res;
      },
      error: (err) => {
        console.error('Error Occured while populating workspace data into header.', err);
      }
    });

  }


  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleWorkspaceMenu() {
    this.showWorkspaceMenu = !this.showWorkspaceMenu;
    if (this.showWorkspaceMenu) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showWorkspaceMenu = false;
    }
  }

  selectWorkspace(workspace: Workspace) {
    // this.currentUser.currentWorkspace = workspace.name;
    this.showWorkspaceMenu = false;
    // Logic to switch workspace would go here
  }

  createNewWorkspace() {

    this.router.navigate(['/user/create-project']);
    this.showWorkspaceMenu = false;
  }


}
