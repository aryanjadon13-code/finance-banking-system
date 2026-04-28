import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { AccountService } from '../../services/account.service';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: any = null;
  accounts: any[] = [];
  isLoading = true;

  constructor(
    public userService: UserService,
    public accountService: AccountService,
    public auth: Auth,
    private cdRef: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfileData(userId);
  }

  loadProfileData(userId: string) {
    this.isLoading = true;

    // Load User Details
    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        this.user = {
          ...userData,
          memberSince: this.formatDate(userData.createdAt),
          initials: this.getInitials(userData.name)
        };
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });

    // Load Accounts to get nominee
    this.accountService.getAccountsByUserId(userId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Failed to load accounts for profile', err)
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
  }

  showComingSoon() {
    alert('This feature is coming soon! 🚧');
  }
}