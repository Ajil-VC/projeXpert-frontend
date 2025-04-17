import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/presentation/Registration/signup.component';
import { LandingComponent } from './features/landing/landing.component';
import { OtpComponent } from './features/auth/presentation/otp/otp.component';
import { CreateProfileComponent } from './features/auth/presentation/create-company/create-profile.component';
import { LayoutComponent } from './features/workspace/components/layout/layout.component';
import { BacklogComponent } from './features/workspace/pages/backlog/presentation/backlog/backlog.component';
import { DashboardComponent } from './features/workspace/pages/dashboard/presentation/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/presentation/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { otpGuard } from './core/guards/otp.guard';
import { workspaceDataResolver } from './core/guards/workspace-data.resolver';

export const routes: Routes = [

    { path: '', component: LandingComponent },
    { path: `register`, component: SignupComponent },
    { path: `verify-otp`, component: OtpComponent, canActivate: [otpGuard] },
    { path: `create-company`, component: CreateProfileComponent, canActivate: [otpGuard] },
    { path: 'login', component: LoginComponent },

    {
        path: 'user', component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], resolve:[workspaceDataResolver] }
        ]
    }

];
