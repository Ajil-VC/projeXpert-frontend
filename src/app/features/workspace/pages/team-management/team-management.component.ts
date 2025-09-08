import { Component } from '@angular/core';
import { MatSlideToggle, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PaginationComponent } from '../../../reusable/pagination/pagination.component';
import { combineLatest, debounceTime, distinctUntilChanged, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { Roles } from '../../../../core/domain/entities/roles.model';
import { PermissionsService } from '../../../../shared/utils/permissions.service';

@Component({
  selector: 'app-team-management',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTooltipModule,
    PaginationComponent
  ],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.css'
})
export class TeamManagementComponent {

  private destroy$ = new Subject<void>();

  users: User[] = [];
  roles: Roles[] = [];
  displayedColumns = ['profile', 'name', 'email', 'role', 'block'];

  currentUser!: User | null;
  selectedRole: string = '';
  selectedStatus: string = '';

  searchTerm: string = '';
  role: string = '';
  status: string = '';

  searchControl = new FormControl('');
  statusControl = new FormControl('');
  roleControl = new FormControl('');

  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private teamSer: TeamManagementService,
    private toast: NotificationService,
    private authService: AuthService,
    private permission: PermissionsService
  ) { }

  ngOnInit() {

    this.currentUser = this.authService.getCurrentUser()
    this.fetchUsers();

    this.teamSer.getRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve the roles.');
      }
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchUsers(page);
  }



  filteredResult$ = combineLatest([
    this.searchControl.valueChanges.pipe(startWith('')),
    this.roleControl.valueChanges.pipe(startWith('')),
    this.statusControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$),
    switchMap(([searchTerm, role, status]) => {

      this.searchTerm = searchTerm?.trim() ?? '';
      this.role = role ?? '';
      this.status = status ?? '';

      return this.teamSer.getUsers(1, this.searchTerm, this.role, this.status);

    })
  ).subscribe({
    next: (res) => {
      if (res.status) {
        this.users = res.result.users;
        this.totalPages = res.result.totalPages;
      }
    }
  })

  profilePic(user: User) {
    if (!user?.profilePicUrl?.url) {
      return null;
    }
    return user.profilePicUrl.url;
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1._id === role2._id : role1 === role2;
  }

  fetchUsers(page: number = 1) {

    this.teamSer.getUsers(page, this.searchTerm, this.role).subscribe({
      next: (res) => {

        if (res.status) {

          this.totalPages = res.result.totalPages;
          this.users = res.result.users;

        }
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve users data');
      }
    })

  }


  updateRole(user: User, newRole: Roles) {
    user.role = newRole;
    this.updateUser(user)
  }

  toggleBlock(user: User, event: boolean) {
    this.updateUser(user, event);
  }

  updateUser(user: User, blockedStatus: boolean | null = null) {
    if (typeof user.role !== 'string') {

      this.teamSer.updateUserRoleAndStatus(user._id, user.role._id, blockedStatus).subscribe({
        next: (res) => {
          if (res.status) {
          }
        },
        error: (err) => {
          this.toast.showError('Couldnt update user.');
        }
      })
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
