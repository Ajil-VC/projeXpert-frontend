import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/presentation/Registration/signup.component';
import { LandingComponent } from './features/landing/landing.component';
import { OtpComponent } from './features/auth/presentation/otp/otp.component';
import { CreateProfileComponent } from './features/auth/presentation/create-company/create-profile.component';
import { LayoutComponent } from './features/workspace/components/layout/layout.component';
import { DashboardComponent } from './features/workspace/pages/dashboard/presentation/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/presentation/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { otpGuard } from './core/guards/otp.guard';
import { workspaceDataResolver } from './core/guards/workspace-data.resolver';
import { ProjectComponent } from './features/workspace/pages/projects/presentation/project/project.component';
import { ProjectinfoComponent } from './features/workspace/pages/projects/presentation/projectinfo/projectinfo.component';
import { ProjectsData } from './core/guards/projects-data.resolver';
import { loginGuardGuard } from './core/guards/login-guard.guard';
import { ChangePswrdComponent } from './features/workspace/components/change-pswrd/change-pswrd.component';
import { forceChangePasswordGuard } from './core/guards/force-change-password.guard';
import { canLeavePasswordchangeGuard } from './core/guards/can-leave-passwordchange.guard';
import { BacklogComponent } from './features/workspace/pages/backlog/presentation/backlog/backlog.component';
import { KanbanComponent } from './features/workspace/pages/kanban/kanban.component';
import { CreateWorkspaceComponent } from './features/workspace/components/create-workspace/create-workspace.component';

export const routes: Routes = [

    { path: '', component: LandingComponent, canActivate: [loginGuardGuard] },
    { path: `register`, component: SignupComponent, canActivate: [loginGuardGuard] },
    { path: `verify-otp`, component: OtpComponent, canActivate: [otpGuard, loginGuardGuard] },
    { path: `create-company`, component: CreateProfileComponent, canActivate: [otpGuard, loginGuardGuard] },
    { path: 'login', component: LoginComponent, canActivate: [loginGuardGuard] },

    {
        path: 'user', component: LayoutComponent, resolve: [workspaceDataResolver], canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [forceChangePasswordGuard] },
            { path: 'change-password', component: ChangePswrdComponent, canDeactivate: [canLeavePasswordchangeGuard] },
            { path: 'backlog', component: BacklogComponent },
            { path: 'create-workspace', component: CreateWorkspaceComponent },
            { path: 'create-project', component: ProjectComponent },
            { path: 'project-info', component: ProjectinfoComponent, resolve: [ProjectsData] },

            { path: 'board', component: KanbanComponent }
        ]
    }

];
