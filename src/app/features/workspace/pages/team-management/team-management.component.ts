import { Component } from '@angular/core';
import { MatSlideToggle, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TeamManagementService } from './team-management.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { User } from '../../../../core/domain/entities/user.model';
import { AuthService } from '../../../auth/data/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-team-management',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.css'
})
export class TeamManagementComponent {

  users: User[] = [];
  roles = ['admin', 'user'];
  displayedColumns = ['profile', 'name', 'email', 'role', 'block'];
  filteredUsers: any[] = []; // Filtered for table

  currentUser!: User | null;
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  constructor(private teamSer: TeamManagementService, private toast: NotificationService, private authService: AuthService) { }

  ngOnInit() {

    this.currentUser = this.authService.getCurrentUser()
    this.fetchUsers();
  }

  profilePic(user: User) {
    if (!user?.profilePicUrl?.url) {
      return null;
    }
    return user.profilePicUrl.url;
  }


  fetchUsers() {

    let allUsers: User[] = [];

    this.teamSer.getUsers().subscribe({
      next: (res) => {
        allUsers = res.result;

        this.users = allUsers.filter(user => user.email !== this.currentUser?.email);
        this.applyFilters();
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve users data');
      }
    })

  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch =
        !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole =
        !this.selectedRole || user.role === this.selectedRole;

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'active' && !user.restrict) ||
        (this.selectedStatus === 'blocked' && user.restrict);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }



  toggleBlock(user: User, event: boolean) {
    this.updateUser(user, event)
  }

  updateRole(user: User, newRole: string) {
    user.role = newRole;
    this.updateUser(user)
  }

  updateUser(user: User, status: boolean | null = null) {

    this.teamSer.controlUser(user._id, status, user.role).subscribe({
      next: (res) => {
        if (res.status) {

          user.restrict = res.result.restrict;
        }
      },
      error: (err) => {
        this.toast.showError('Couldnt update user.');
      }
    })
  }


}
