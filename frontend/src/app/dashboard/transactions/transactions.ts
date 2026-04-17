import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {

  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;

  transactions: any[] = [];

  ngOnInit() {
    // Dummy data (later API se replace hoga)
    this.totalBalance = 245800;
    this.totalIncome = 58500;
    this.totalExpenses = 18240;

    this.transactions = [
     
  {
    title: 'Salary Credit',
    date: 'Apr 1, 2026',
    type: 'NEFT',
    amount: 45000,
    status: 'Completed',
    category: 'credit'
  },
  {
    title: 'Amazon Shopping',
    date: 'Mar 31, 2026',
    type: 'UPI',
    amount: 2340,
    status: 'Completed',
    category: 'debit'
  }
,
      { title: 'Electricity Bill', date: 'Mar 30, 2026', amount: 1200, type: 'debit', status: 'Paid', method: 'AUTO' },
      { title: 'Transfer to Rahul', date: 'Mar 28, 2026', amount: 5000, type: 'debit', status: 'Completed', method: 'IMPS' },
      { title: 'Freelance Payment', date: 'Mar 20, 2026', amount: 12000, type: 'credit', status: 'Completed', method: 'NEFT' }
    ];
  }
}