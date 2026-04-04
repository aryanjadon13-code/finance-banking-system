import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import{RegisterComponent} from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { EmailSent } from './auth/email-sent/email-sent';
import { verifyOtp } from './auth/verify-otp/verify-otp';
import { ResetPassword } from './auth/reset-password/reset-password';



export const routes: Routes = [
   { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path:'forgot-password', component: ForgotPassword},
  { path: 'email-sent', component: EmailSent },
  {path: 'verify-otp', component: verifyOtp},
  {path:'reset-password',component: ResetPassword}
];