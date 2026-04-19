import { Component } from '@angular/core';
import { ChartComponent } from './chart/chart';
import { CommonModule } from '@angular/common';
import { Header } from '../layout/header/header';
import { Sidebar } from '../layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { log } from 'node:console';


@Component({
  selector: 'app-dashboard',
  standalone: true,                
  imports: [CommonModule, ChartComponent , Header, Sidebar, RouterOutlet],   
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']  
})
export class Dashboard {


  constructor(public router: Router, private cdRef: ChangeDetectorRef) {}

  isMainDashboard() {
    return this.router.url === '/dashboard';
  }

goToSendMoney() {
  this.router.navigate(['/dashboard/send-money']);
}
  comingSoonMessage = '';
showToast = false;
timeoutRef:any=null;

showComingSoon(feature: string) {
 
  this.comingSoonMessage = `${feature} feature coming soon 🚧`;
  this.showToast = true;

  this.timeoutRef=setTimeout(() => {
    this.showToast = false;
    this.cdRef.detectChanges();
    this.timeoutRef=null;
  },2000);
}

getPageTitle() {
  const url = this.router.url;

  if (url.includes('send-money')) return 'Send Money';
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


    this.totalBalance = 245800;
    this.totalIncome = 58500;
    this.totalExpenses = 18240;
    this.pendingBills = 3450;

    this.transactions = [
    { title: 'Salary Credit', date: 'Apr 1', amount: 45000, type: 'credit' },
    { title: 'Amazon Shopping', date: 'Mar 30', amount: 2340, type: 'debit' },
    { title: 'Electricity Bill', date: 'Mar 28', amount: 1200, type: 'debit' },
    { title: 'Transfer to Rahul', date: 'Mar 26', amount: 5000, type: 'debit' }
  ];

     this.accounts = [
    { name: 'Savings Account', balance: 218600 },
    { name: 'Current Account', balance: 27200 },
    { name: 'Fixed Deposit', balance: 100000 }
  ];
  }
}