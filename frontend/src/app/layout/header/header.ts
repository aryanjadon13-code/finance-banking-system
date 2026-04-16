import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  title = '';
  subtitle = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.url);
      }
    });
  }

  updateHeader(url: string) {
    if (url.includes('transactions')) {
      this.title = 'Transaction History';
      this.subtitle = 'All your transactions in one place';
    } 
    else if (url.includes('accounts')) {
      this.title = 'Accounts';
      this.subtitle = 'Manage your bank accounts';
    }
    else if (url.includes('payments')) {
      this.title = 'Payments';
      this.subtitle = 'Make and track payments';
    }
    else {
      this.title = 'Dashboard';
      this.subtitle = "Welcome back, Here's your financial overview.";
    }
  }
}