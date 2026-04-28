import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  accounts: any[] = [];
  transactions: any[] = [];
  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;
  isLoading = false;

  comingSoonMessage = '';
  showToast = false;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private auth: Auth,
    private cdRef: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData(userId);
  }

  loadData(userId: string) {
    this.isLoading = true;

    // Fetch Accounts
    this.accountService.getAccountsByUserId(userId).subscribe({
      next: (res: any[]) => {
        this.accounts = res;
        this.totalBalance = this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this.isLoading = false;
      }
    });

    // Fetch Recent Activity (Transactions)
    this.transactionService.getTransaction(parseInt(userId, 10), 0, '', 'All', 'All').subscribe({
      next: (res: any) => {
        const txList = res.data || [];
        this.transactions = txList.slice(0, 5); // Just show last 5
        this.calculateStats(txList);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }

  calculateStats(txList: any[]) {
    this.totalIncome = 0;
    this.totalExpenses = 0;
    txList.forEach(t => {
      let amount = 0;
      if (t.amount) {
        amount = parseFloat(String(t.amount).replace(/[^0-9.]/g, ''));
      }
      if (t.type === 'credit') this.totalIncome += amount;
      else if (t.type === 'debit') this.totalExpenses += amount;
    });
  }

  showComingSoon(feature: string) {
    this.comingSoonMessage = `${feature} feature coming soon 🚧`;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.cdRef.detectChanges();
    }, 2000);
  }

  getAccountTypeClass(type: string): string {
    switch (type.toUpperCase()) {
      case 'SAVINGS': return 'primary';
      case 'CURRENT': return 'business';
      case 'FIXED_DEPOSIT': return 'highlight';
      default: return '';
    }
  }

  getAccountIcon(type: string): string {
    switch (type.toUpperCase()) {
      case 'SAVINGS': return 'fas fa-piggy-bank';
      case 'CURRENT': return 'fas fa-briefcase';
      case 'FIXED_DEPOSIT': return 'fas fa-lock';
      default: return 'fas fa-university';
    }
  }
}
