import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartComponent } from './chart/chart';
import { CommonModule } from '@angular/common';
import { Header } from '../layout/header/header';
import { Sidebar } from '../layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { SidebarService } from '../layout/sidebar/sidebar.service';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent, Header, Sidebar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  constructor(
    public router: Router,
    private cdRef: ChangeDetectorRef,
    public sidebarService: SidebarService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private auth: Auth
  ) {}

  addBeneficiary() {
    this.router.navigate(['/dashboard/add-beneficiary']);
  }

  isMainDashboard() {
    return this.router.url === '/dashboard';
  }

  goToPayments() {
    this.router.navigate(['/dashboard/payments']);
  }

  comingSoonMessage = '';
  showToast = false;
  timeoutRef: any = null;

  showComingSoon(feature: string) {
    this.comingSoonMessage = `${feature} feature coming soon 🚧`;
    this.showToast = true;
    this.timeoutRef = setTimeout(() => {
      this.showToast = false;
      this.cdRef.detectChanges();
      this.timeoutRef = null;
    }, 2000);
  }

  getPageTitle() {
    const url = this.router.url;
    if (url.includes('send-money')) return 'Send Money';
    if (url.includes('beneficiaries')) return 'Beneficiaries';
    if (url.includes('add-beneficiary')) return 'Add Beneficiary';
    if (url.includes('create-account')) return 'Create Account';
    if (url.includes('transactions')) return 'Transactions';
    if (url.includes('accounts')) return 'Accounts';
    return 'Dashboard';
  }

  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;
  pendingBills = 0;
  transactions: any[] = [];
  accounts: any[] = [];

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData(userId);
  }

  private loadDashboardData(userId: string) {
    // Fetch accounts
    this.accountService.getAccountsByUserId(userId).subscribe({
      next: (res: any[]) => {
        this.accounts = res.map(acc => ({
          name: acc.accountType === 'SAVINGS' ? 'Savings Account' :
                acc.accountType === 'CURRENT' ? 'Current Account' : 'Fixed Deposit',
          accountNumber: acc.accountNumber,
          balance: acc.balance
        }));
        this.totalBalance = this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
      }
    });

    // Fetch transactions
    this.transactionService.getTransaction(parseInt(userId, 10), 0, '', 'All', 'All').subscribe({
      next: (res: any) => {
        const txList = res.data || [];   // API returns { status, message, data: [...] }
        this.transactions = txList.map((t: any) => {
          let parsedAmount = 0;
          if (t.amount) {
            const rawAmount = String(t.amount).replace(/[^0-9.]/g, '');
            parsedAmount = parseFloat(rawAmount);
          }
          return {
            title: t.name,
            date: t.date,
            amount: parsedAmount,
            type: t.type
          };
        });

        this.totalIncome = 0;
        this.totalExpenses = 0;
        for (const t of this.transactions) {
          if (t.type === 'credit') this.totalIncome += t.amount;
          else if (t.type === 'debit') this.totalExpenses += t.amount;
        }
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }
}
