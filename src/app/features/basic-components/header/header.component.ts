
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/data/auth.service';
import { User } from '../../../core/domain/entities/user.model';
import { Workspace } from '../../../core/domain/entities/workspace.model';
import { Router, RouterLink } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { Project } from '../../../core/domain/entities/project.model';
import { SharedService } from '../../../shared/services/shared.service';
import { Task } from '../../../core/domain/entities/task.model';
import { BacklogService } from '../../workspace/pages/backlog/data/backlog.service';
import { Sprint } from '../../../core/domain/entities/sprint.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateWorkspaceComponent } from '../../workspace/components/create-workspace/create-workspace.component';
import { SocketService } from '../../../shared/services/socket.service';
import { Notification } from '../../../core/domain/entities/notification.model';
import { NotificationService } from '../../../core/data/notification.service';
import { ProjectDataService } from '../../../shared/services/project-data.service';
import { PermissionsService } from '../../../shared/utils/permissions.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  @Input() systemRole!: string;

  @ViewChild('wrapper') wrapperRef!: ElementRef;


  showWorkspaceMenu = false;
  showUserMenu = false;
  showProjectMenu = false;
  isMobileMenuOpen = false;
  availableProjects: Project[] = [];

  isDropdownOpen = false;

  notifications: Array<Notification> = [];

  currentUser!: User;
  workspaces: Workspace[] = [];
  currentWorkspace!: Workspace | null;

  isAdmin: boolean = false;

  canCreateWorkspace: boolean = false;
  canCreateProject: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private layoutSer: LayoutService,
    private shared: SharedService,
    private cdr: ChangeDetectorRef,
    private backlogSer: BacklogService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private socketSer: SocketService,
    private toast: NotificationService,
    private projectSer: ProjectDataService,
    private permission: PermissionsService
  ) {

    if (this.permission.has(['create_workspace'])) {
      this.canCreateWorkspace = true;
    }
    if (this.permission.has(['create_project'])) {
      this.canCreateProject = true;
    }
  }

  get notificationCount(): number {

    return this.notifications.filter(note => note.read == false).length;
  }

  isCompanyUser() {
    return this.systemRole === 'company-user';
  }

  get profilePic() {

    if (this.currentUser && this.currentUser.profilePicUrl) {
      return this.currentUser.profilePicUrl.url;
    }
    return null;
  }

  get currentUserName() {
    if (this.currentUser && this.currentUser.name) {
      return this.currentUser.name;
    }
    return '!';
  }

  ngOnInit() {
    //Connecting to socket
    this.socketSer.connect();

    this.layoutSer.getNotifications(this.systemRole).subscribe({
      next: (res) => {

        const result = res as { status: boolean, result: Array<Notification> };
        this.notifications = result.result;

      }
    })

    this.authService.user$.subscribe({
      next: (res) => {
        if (res) {
          this.currentUser = res;
          this.workspaces = this.currentUser.workSpaces || [];
          const projects = res?.defaultWorkspace.projects as unknown as Project[];
          this.availableProjects = projects || [];
        }

      }
    });

    this.layoutSer.prSubject.subscribe({
      next: (res: unknown) => {
        const project = res as Project;
        if (project.workSpace === this.authService.getWorkSpace()?._id) {
          this.availableProjects.push(project);
          this.cdr.detectChanges();
        }
      }
    });

    this.authService.workSpace$.subscribe({
      next: (res) => {

        this.currentWorkspace = res;
      }
    });

    this.projectSer.delProject$.subscribe({
      next: (res) => {
        const index = this.availableProjects.findIndex(proj => proj._id === res._id);
        this.availableProjects.splice(index, 1);
      }
    })

    this.socketSer.notification().subscribe({

      next: (res) => {
        this.notifications.unshift(res);
      }
    })

  }


  readNotification(notification: Notification | null = null, removall = false) {

    this.layoutSer.makeNotificationsAsRead(notification?._id, removall).subscribe({
      next: (res) => {
        const data = res as { status: boolean };
        if (data.status && removall && !notification) {
          this.notifications = [];
        } else if (!notification && !removall) {
          this.notifications.forEach(note => {
            note.read = true;
          })
        } else if (notification) {

          const ind = this.notifications.findIndex(note => note._id === notification._id);
          this.notifications[ind].read = true;
          this.router.navigate([notification?.link]);
        }
      }
    })
  }


  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showWorkspaceMenu = false; // Close workspace menu if user menu opened
      this.showProjectMenu = false;
    }
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleWorkspaceMenu() {
    this.showWorkspaceMenu = !this.showWorkspaceMenu;
    if (this.showWorkspaceMenu) {
      this.showUserMenu = false; // Close user menu if workspace menu opened
      this.showProjectMenu = false;
    }
  }

  toggleProjectsMenu() {
    this.showProjectMenu = !this.showProjectMenu;
    if (this.showProjectMenu) {
      this.showUserMenu = false; // Close user menu if workspace menu opened
      this.showWorkspaceMenu = false;
    }
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInsideDropdown = target.closest('.dropdown');
    const clickedInsideUserDropdown = target.closest('.user-menu') || target.closest('.icon-button');

    if (!clickedInsideDropdown && !clickedInsideUserDropdown) {
      this.showWorkspaceMenu = false;
      this.showUserMenu = false;
      this.showProjectMenu = false;
      this.isDropdownOpen = false;
    }

  }

  selectWorkspace(workspace: Workspace) {

    this.showWorkspaceMenu = false;

    this.layoutSer.selectWorkspace(workspace._id as string).subscribe({
      next: (res) => {

        this.availableProjects = res.result?.projects as Project[] | [];
        this.shared.setProject(res.result?.projects[0]?._id);
        this.authService.setCurrentWorkSpace(res.result);

      },
      error: (err) => {
        this.toast.showError('Couldnt change the workspace.');
      }
    })

  }

  selectProject(projectId: String | undefined | null = null) {

    this.showProjectMenu = false;
    if (!projectId) return;

    this.layoutSer.getProject(projectId as string).subscribe({
      next: (res: { status: boolean, result: Project, tasks: Task[] }) => {
        this.layoutSer.setProjectId(res.result._id as string);
        this.shared.curProject.next(res.result);
        this.shared.fetchTeamMembers();
      }
    });


    if (this.permission.has(['view_sprint'])) {
      this.backlogSer.getSprints(projectId as string).subscribe({
        next: (res: { status: boolean, result: Sprint[] }) => {
          if (!res.status) {
            this.toast.showError('Couldnt retrieve sprints.');
            return;
          }

          this.ngZone.run(() => {
            this.backlogSer.sprintSubject.next(res.result);
          });

        },
        error: (err) => {
          this.toast.showError('Couldnt retrieve sprints.');
        }
      });
    }


  }

  createNewWorkspace() {

    const dialogRef = this.dialog.open(CreateWorkspaceComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe({
      next: (result: { workspaceName: string }) => {
        if (result.workspaceName) {
          this.layoutSer.createWorkspace(result.workspaceName).subscribe({
            next: (res) => {

              if (!res.status) {
                this.toast.showInfo(res.message);
                return;
              }
              this.workspaces.push(res.result);
              this.toast.showSuccess(res.message);
            },
            error: (err) => {
              this.toast.showError("Error occured while creating workspace.");
            }
          })
        }
      }
    });
  }

  logout() {
    this.authService.logout()
  }

}
