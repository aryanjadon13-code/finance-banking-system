import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Auth } from '../../services/auth';
import { BeneficiaryService } from '../../services/beneficiary-service/beneficiary-service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: Auth,
    private beneficiaryService: BeneficiaryService,
    private accountService: AccountService
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login success, setting session...');
        
        // 1. Set the session first (so subsequent API calls have the token)
        this.authService.setUserSession(res.token, res.userId, res.email);

        // 2. Sync beneficiaries
        this.beneficiaryService.syncCacheForCurrentUser();

        // 3. Check if user has accounts to decide redirection
        this.accountService.getAccountsByUserId(res.userId).subscribe({
          next: (accounts: any[]) => {
            if (accounts && accounts.length > 0) {
              console.log('Existing user found, redirecting to dashboard');
              this.router.navigate(['/dashboard']);
            } else {
              console.log('New user found (no accounts), redirecting to create-account');
              this.router.navigate(['/dashboard/create-account']);
            }
          },
          error: (err) => {
            console.error('Failed to check accounts, defaulting to dashboard', err);
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Invalid email or password. Please try again.');
      }
    });
  }
}