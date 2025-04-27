import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectDataService } from '../../../../../../shared/services/project-data.service';
import { Project } from '../../../../../../core/domain/entities/project.model';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectModalComponent } from '../modal/edit-project-modal/edit-project-modal.component';
import { ConfirmDialogComponent } from '../modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projectinfo',
  imports: [CommonModule],
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




  statusFilters = {
    active: true,
    archived: false,
    completed: false
  };

  constructor(
    private projectService: ProjectDataService,
    private router: Router,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {

    this.projectService.project$.subscribe({

      next: (res) => {
        if (!res) {
          this.projects = [];
          return;
        };

        this.projects = res;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error while getting projects', err);
      }

    })
  }


  applyFilters(): void {

    // Filter by status
    let filtered = this.projects.filter(project => {
      if (this.statusFilters.active && project.status === 'active') return true;
      if (this.statusFilters.archived && project.status === 'archived') return true;
      if (this.statusFilters.completed && project.status === 'completed') return true;
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
    this.router.navigate(['/projects', project]);
  }

  editProject(event: Event, project: Project): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EditProjectModalComponent, {
      width: '500px',
      data: { ...project }  // Send current project details here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.projectService.updateProject(result).subscribe({
          next: (res) => {
            if (!res.status) throw new Error('Projects couldnt retrieve after updation');
            this.projects = res.data;
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
          },
          error: (err) => {
            console.error('Error deleting project', err);
          }
        });
      }
    });
  }

}