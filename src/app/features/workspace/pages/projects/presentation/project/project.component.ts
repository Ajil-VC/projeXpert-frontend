import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsUseCase } from '../../domain/projects.domain';
import { ProjectService } from '../../data/project.service';
import { Company } from '../../../../../../core/domain/entities/company.model';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../../../shared/services/layout.service';
import { Project } from '../../../../../../core/domain/entities/project.model';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  providers: [
    { provide: ProjectsUseCase, useClass: ProjectService }
  ]
})
export class ProjectComponent {


  projectForm!: FormGroup;
  isButtonDisabled: boolean = false;

  workSpaces!: Array<{ value: String, name: String }>;
  priorityOptions = ['low', 'medium', 'high', 'critical']
  constructor(
    private fb: FormBuilder,
    private projectsInterface: ProjectsUseCase,
    private router: Router,
    private layoutSer: LayoutService
  ) {

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

    this.isButtonDisabled = true;
    const { projectName, workspace, priority } = this.projectForm.value;
    this.projectsInterface.createProject(projectName, workspace, priority).subscribe({

      next: (res: { status: boolean, createdProject: Project }) => {

        this.router.navigate(['user/project-info']);
        this.layoutSer.prSubject.next(res.createdProject);

      },
      error: (err) => {
        console.error(err);
      }

    });
  }

}
