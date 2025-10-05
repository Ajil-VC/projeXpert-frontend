import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsUseCase } from '../../domain/projects.domain';
import { ProjectService } from '../../data/project.service';
import { Company } from '../../../../../../core/domain/entities/company.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../../../shared/services/layout.service';
import { Project } from '../../../../../../core/domain/entities/project.model';
import { NotificationService } from '../../../../../../core/data/notification.service';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  providers: [
    { provide: ProjectsUseCase, useClass: ProjectService }
  ]
})
export class ProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectsInterface = inject(ProjectsUseCase);
  private router = inject(Router);
  private layoutSer = inject(LayoutService);
  private toast = inject(NotificationService);



  projectForm!: FormGroup;
  isButtonDisabled = false;

  workSpaces!: { value: string, name: string }[];
  priorityOptions = ['low', 'medium', 'high', 'critical']
  constructor() {

    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      workspace: ['', Validators.required],
      priority: ['']
    })
  }

  ngOnInit() {

    this.projectsInterface.getProjectInitializingData().subscribe({
      next: (res) => {

        const companyData = res.data as Company;
        this.workSpaces = companyData.workspaces.map(ele => {
          return {
            value: ele._id,
            name: ele.name
          }
        });

      },
      error: (err) => {
        console.error('Projects initializer error', err);
      }
    });

  }

  get projectNameControl() {
    return this.projectForm.get('projectName');
  }
  get workspaceControl() {
    return this.projectForm.get('workspace');
  }

  onSubmit() {

    const { projectName, workspace, priority } = this.projectForm.value;
    if (!priority) {
      this.toast.showError('Please select the priority');
      return;
    }
    this.isButtonDisabled = true;
    this.projectsInterface.createProject(projectName, workspace, priority).subscribe({

      next: (res: { status: boolean, createdProject: Project }) => {

        if (!res.status) {
          this.toast.showError('Project couldnt create due to some reasons');
          return;
        }

        this.router.navigate(['user/project-info']);
        this.layoutSer.prSubject.next(res.createdProject);
        this.toast.showSuccess('Project created successfully.');
        return;

      },
      error: () => {
        this.toast.showError('Couldnt create the project due to some error');
      }

    });
  }

}
