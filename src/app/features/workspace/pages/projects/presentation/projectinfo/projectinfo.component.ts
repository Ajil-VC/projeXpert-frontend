import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectDataService } from '../../../../../../shared/services/project-data.service';
import { Project } from '../../../../../../core/domain/entities/project.model';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectModalComponent } from '../modal/edit-project-modal/edit-project-modal.component';
import { ConfirmDialogComponent } from '../modal/confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from '../../../../../reusable/pagination/pagination.component';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { AuthService } from '../../../../../auth/data/auth.service';

@Component({
  selector: 'app-projectinfo',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './projectinfo.component.html',
  styleUrl: './projectinfo.component.css'
})
export class ProjectinfoComponent {

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm = '';
  sortField = 'name';
  sortDirection = 'asc';
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';

  currentPage: number = 1;
  totalPages: number = 1;

  statusFilters = {
    active: true,
    archived: false,
    completed: false
  };

  constructor(
    private projectService: ProjectDataService,
    private router: Router,
    public dialog: MatDialog,
    private shared: SharedService,
    private auth: AuthService

  ) { }

  ngOnInit(): void {

    this.getProjectData(1, this.statusFilters);
    this.shared.currentPro$.subscribe((project) => {
      if (this.auth.getCurrentUser()?.role === 'admin') {

        this.getProjectData(1, this.statusFilters);
      }

    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getProjectData(page, this.statusFilters);
  }

  getProjectData(page: number = 1, filter: {
    active: boolean,
    archived: boolean,
    completed: boolean
  }) {
    this.projectService.getProjectData(page, filter).subscribe({
      next: (res) => {

        if (!res.status || !res.projects) {
          this.projects = [];
          return;
        };
        this.projects = res.projects;
        this.totalPages = res.totalPages;
        this.applyFilters();

      },
      error: (err) => {
        console.error('Error fetching projects', err);
      }
    });
  }

  applyFilters(): void {

    // Filter by status
    let filtered = this.projects.filter(project => {
      if (this.statusFilters.active && project.status === 'active') return true;
      if (this.statusFilters.archived && project.status === 'archived') return true;
      if (this.statusFilters.completed && project.status === 'completed') return true;
      if (!this.statusFilters.active && !this.statusFilters.archived && !this.statusFilters.completed) {
        return true;
      }
      return false;
    });

    // // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term)
      );
    }

    // // Apply sorting
    filtered.sort((a, b) => {
      let valueA: any = a[this.sortField as keyof Project];
      let valueB: any = b[this.sortField as keyof Project];

      // Handle dates
      if (this.sortField === 'createdAt' || this.sortField === 'updatedAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.filteredProjects = filtered;
  }

  toggleStatusFilter(status: 'active' | 'archived' | 'completed'): void {
    this.statusFilters[status] = !this.statusFilters[status];

    const trueCount = Object.values(this.statusFilters).filter(v => v === true).length;
    if (trueCount == 1) {
      this.currentPage = 1;
    }

    this.onPageChange(this.currentPage);
    this.applyFilters();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  setSortField(field: string): void {
    if (this.sortField === field) {
      this.toggleSortDirection();
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  search(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  openCreateProjectDialog(): void {

    this.router.navigate(['/user/create-project']);

  }

  openProject(project: Project): void {
    // this.router.navigate(['/projects', project]);
  }

  editProject(event: Event, project: Project): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EditProjectModalComponent, {
      width: '500px',
      data: { ...project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.projectService.updateProject(result).subscribe({
          next: (res) => {
            if (!res.status) throw new Error('Projects couldnt retrieve after updation');

            const ind = this.projects.findIndex(p => p._id === res.data._id);
            const updated = [...this.projects];
            updated[ind] = res.data;
            this.projects = updated;

            this.applyFilters();
          },
          error: (err) => {
            console.error('Error occured while updating project.', err);
          }
        })


      }
    });

  }

  deleteProject(event: Event, project: Project): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete ${project.name}? This action cannot be undone.`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project._id as string).subscribe({
          next: () => {
            this.projects = this.projects.filter(p => p._id !== project._id);
            this.applyFilters();
            this.projectService.removeProject(project);
          },
          error: (err) => {
            console.error('Error deleting project', err);
          }
        });
      }
    });
  }

}