import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { EmailSent } from './auth/email-sent/email-sent';
import { verifyOtp } from './auth/verify-otp/verify-otp';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Transactions } from './dashboard/transactions/transactions';
import { Accounts } from './dashboard/accounts/accounts';
import { Payments } from './dashboard/payments/payments';
import { Profile } from './dashboard/profile/profile';
import { Settings } from './dashboard/settings/settings';
import { Dashboard } from './dashboard/dashboard';
import { CreateAccount } from './create-account/create-account';
import { SendMoney } from './pages/send-money/send-money';
import { Beneficiaries } from './pages/beneficiaries/beneficiaries';
import { AddBeneficiary } from './pages/add-beneficiary/add-beneficiary';

export const routes: Routes = [

  // ✅ Auth routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'email-sent', component: EmailSent },
  { path: 'verify-otp', component: verifyOtp },
  { path: 'reset-password', component: ResetPassword },

  // ✅ Dashboard route (IMPORTANT)
 {
  path: 'dashboard',
  component: Dashboard,
  children: [
    { path: 'transactions', component: Transactions },
    { path: 'accounts', component: Accounts },
    { path: 'payments', component: Payments },
    { path: 'profile', component: Profile },
    { path: 'settings', component: Settings },
    { path: 'create-account', component: CreateAccount, data: { title: 'Create Account' } },
    { path: 'send-money', component: SendMoney, data: { title: 'Send Money' } },
    { path: 'beneficiaries', component: Beneficiaries, data: { title: 'Beneficiaries' } },
    { path: 'add-beneficiary', component: AddBeneficiary, data: { title: 'Add Beneficiary' } }
  ]
}

];
