import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Input, NgZone } from '@angular/core';
import { AuthService } from '../../auth/data/auth.service';
import { User } from '../../../core/domain/entities/user.model';
import { Workspace } from '../../../core/domain/entities/workspace.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { Project } from '../../../core/domain/entities/project.model';
import { SharedService } from '../../../shared/services/shared.service';
import { Task } from '../../../core/domain/entities/task.model';
import { BacklogService } from '../../workspace/pages/backlog/data/backlog.service';
import { Sprint } from '../../../core/domain/entities/sprint.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateWorkspaceComponent } from '../../workspace/components/create-workspace/create-workspace.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  @Input() systemRole!: string;

  showWorkspaceMenu = false;
  showUserMenu = false;
  showProjectMenu = false;
  isMobileMenuOpen = false;
  availableProjects: any;

  currentUser!: any;
  currentWorkspace!: Workspace | null;

  canCreateWorkspace: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private layoutSer: LayoutService,
    private shared: SharedService,
    private cdr: ChangeDetectorRef,
    private backlogSer: BacklogService,
    private ngZone: NgZone,
    private dialog: MatDialog,

  ) {

    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      this.canCreateWorkspace = true;
    }

  }

  canActivateNavbar() {
    return this.systemRole === 'company-user';
  }

  ngOnInit() {

    this.authService.user$.subscribe({
      next: (res) => {

        this.currentUser = res
        this.availableProjects = res?.defaultWorkspace.projects;

      },
      error: (err) => {
        console.error('Error Occured while populating user data into header.', err);
      }
    });

    this.layoutSer.prSubject.subscribe({
      next: (res: unknown) => {
        const project = res as Project;
        this.availableProjects.push(project);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error occurred while updating projects list', err);
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

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showWorkspaceMenu = false; // Close workspace menu if user menu opened
      this.showProjectMenu = false;
    }
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
    }

  }

  selectWorkspace(workspace: Workspace) {
    // this.currentUser.currentWorkspace = workspace.name;
    this.showWorkspaceMenu = false;
    // Logic to switch workspace would go here
  }

  selectProject(projectId: string) {

    this.showProjectMenu = false;

    this.layoutSer.getProject(projectId).subscribe({
      next: (res: { status: boolean, result: Project, tasks: Task[] }) => {

        this.layoutSer.setProjectId(res.result._id as string);
        this.shared.curProject.next(res.result);
        this.shared.tasksSubject.next(res.tasks);
      },
      error: (err) => {
        console.log("Error while getting project data", err);
      }
    });

    this.backlogSer.getSprints(projectId).subscribe({
      next: (res: { status: boolean, result: Sprint[] }) => {
        if (!res.status) {
          console.error('Error occured while getting sprints');
          return;
        }

        this.ngZone.run(() => {
          this.backlogSer.sprintSubject.next(res.result);
        });

      },
      error: (err) => {
        console.error('Error occured while getting sprints', err);
      }
    });


  }

  createNewWorkspace() {

    const dialogRef = this.dialog.open(CreateWorkspaceComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe({
      next: (result: { workspaceName: string }) => {
        if (result.workspaceName !== '') {
          this.layoutSer.createWorkspace(result.workspaceName).subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.error("Error occured while creating workspace.", err);
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
