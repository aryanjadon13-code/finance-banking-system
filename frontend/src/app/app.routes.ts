import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import{RegisterComponent} from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { EmailSent } from './auth/email-sent/email-sent';
import { verifyOtp } from './auth/verify-otp/verify-otp';
import { ResetPassword } from './auth/reset-password/reset-password';

import { Layout } from './layout/layout/layout';
import { Auth } from './services/auth';

import { Sidebar } from './layout/sidebar/sidebar';




export const routes: Routes = [
   { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
 
  { path:'forgot-password', component: ForgotPassword},
  { path: 'email-sent', component: EmailSent },
  {path: 'verify-otp', component: verifyOtp},
  {path:'reset-password',component: ResetPassword},
  
];