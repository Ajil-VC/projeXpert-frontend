import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/presentation/Registration/signup.component';
import { LandingComponent } from './features/landing/landing.component';
import { OtpComponent } from './features/auth/presentation/otp/otp.component';
import { CreateProfileComponent } from './features/auth/presentation/create-company/create-profile.component';
import { LayoutComponent } from './features/basic-components/layout/layout.component';
import { DashboardComponent } from './features/workspace/pages/dashboard/presentation/dashboard/dashboard.component';
import { LoginComponent } from './features/reusable/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { otpGuard } from './core/guards/otp.guard';
import { workspaceDataResolver } from './core/guards/workspace-data.resolver';
import { ProjectComponent } from './features/workspace/pages/projects/presentation/project/project.component';
import { ProjectinfoComponent } from './features/workspace/pages/projects/presentation/projectinfo/projectinfo.component';
import { loginGuardGuard } from './core/guards/login-guard.guard';
import { ChangePswrdComponent } from './features/workspace/components/change-pswrd/change-pswrd.component';
import { forceChangePasswordGuard } from './core/guards/force-change-password.guard';
import { canLeavePasswordchangeGuard } from './core/guards/can-leave-passwordchange.guard';
import { BacklogComponent } from './features/workspace/pages/backlog/presentation/backlog/backlog.component';
import { KanbanComponent } from './features/workspace/pages/kanban/kanban.component';
import { CreateWorkspaceComponent } from './features/workspace/components/create-workspace/create-workspace.component';
import { ChatPageComponent } from './features/workspace/pages/chat/chat-page/chat-page.component';
import { adminLoginGuard } from './core/guards/admin/admin-login.guard';
import { AdminDashboardComponent } from './features/admin/presentation/admin-dashboard/admin-dashboard.component';
import { adminDataResolver } from './core/guards/admin/admin-data.resolver';
import { verifyAdminGuard } from './core/guards/admin/verify-admin.guard';
import { CompanyComponent } from './features/admin/presentation/company/company.component';
import { Forbidden403Component } from './features/reusable/forbidden-403/forbidden-403.component';
import { VideoCallComponent } from './features/workspace/pages/video-call/video-call.component';
import { SubscriptionComponent } from './features/workspace/pages/subscription/subscription.component';
import { SuccessComponent } from './features/workspace/pages/subscription/success/success.component';
import { CancelComponent } from './features/workspace/pages/subscription/cancel/cancel.component';
import { SettingsComponent } from './features/workspace/pages/settings/settings.component';
import { adminResolver } from './core/guards/admin/admin.resolver';
import { SubscriptionDetailComponent } from './features/admin/presentation/subscription/subscription.component';
import { TeamManagementComponent } from './features/workspace/pages/team-management/team-management.component';
import { CreatePlanComponent } from './features/admin/presentation/create-plan/create-plan.component';
import { GroupCallComponent } from './features/workspace/pages/group-call/group-call.component';
import { RoomComponent } from './features/workspace/pages/group-call/room/room.component';
import { RevenueComponent } from './features/admin/presentation/revenue/revenue.component';

export const routes: Routes = [

    { path: 'forbidden', component: Forbidden403Component },
    { path: '', component: LandingComponent, canActivate: [loginGuardGuard] },
    { path: `register`, component: SignupComponent, canActivate: [loginGuardGuard] },
    { path: `verify-otp`, component: OtpComponent, canActivate: [otpGuard, loginGuardGuard] },
    { path: `create-company`, component: CreateProfileComponent, canActivate: [otpGuard, loginGuardGuard] },
    { path: 'login', component: LoginComponent, canActivate: [loginGuardGuard], data: { systemRole: 'company-user' } },

    {
        path: 'user', component: LayoutComponent, data: { systemRole: 'company-user' }, resolve: { initialized: workspaceDataResolver }, canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [forceChangePasswordGuard] },
            { path: 'change-password', component: ChangePswrdComponent, canDeactivate: [canLeavePasswordchangeGuard] },
            { path: 'backlog', component: BacklogComponent },
            { path: 'create-workspace', component: CreateWorkspaceComponent },
            { path: 'create-project', component: ProjectComponent },
            { path: 'project-info', component: ProjectinfoComponent },
            { path: 'settings', component: SettingsComponent },

            { path: 'board', component: KanbanComponent },
            { path: 'chat', component: ChatPageComponent },
            { path: 'video-call', component: VideoCallComponent },
            { path: 'meeting', component: GroupCallComponent },
            { path: 'room/:roomId', component: RoomComponent },
            { path: 'teams-members', component: TeamManagementComponent },
            { path: 'subscription', component: SubscriptionComponent },
            { path: 'success', component: SuccessComponent },
            { path: 'cancel', component: CancelComponent }
        ]
    },


    { path: 'admin/login', component: LoginComponent, canActivate: [adminLoginGuard], data: { systemRole: 'platform-admin' } },
    {
        path: 'admin', component: LayoutComponent, data: { systemRole: 'platform-admin' }, canActivate: [verifyAdminGuard], resolve: { adminData: adminResolver },
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'companies', component: CompanyComponent, resolve: { companyData: adminDataResolver } },
            { path: 'settings', component: SettingsComponent, data: { systemRole: 'platform-admin' } },
            { path: 'revenue', component: RevenueComponent },
            { path: 'create-plan', component: CreatePlanComponent },
            { path: 'subscription', component: SubscriptionDetailComponent }
        ]

    }

];
