import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  title: string = '';
  subtitle: string = '';

  constructor(private router: Router, private sidebarService: SidebarService) {}

  toggleSidebar() {
  this.sidebarService.toggle();
}

  ngOnInit() {
    this.updateHeader(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.url);
      }
    });
    this.updateHeader(this.router.url);
  }

updateHeader(url: string) {

  if (url.includes('send-money')) {
    this.title = 'Send Money';
    this.subtitle = 'Transfer funds securely';
  }

  else if (url.includes('create-account')) {
    this.title = 'Create Account';
    this.subtitle = 'Open a new bank account';
  }

  else if (url.includes('transactions')) {
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

  else if (url.includes('profile')) {
    this.title = 'Profile';
    this.subtitle = 'Manage your personal details';
  }

  else if (url.includes('settings')) {
    this.title = 'Settings';
    this.subtitle = 'Configure your preferences';
  }

  else {
    this.title = 'Dashboard';
    this.subtitle = "Welcome back, Here's your financial overview.";
  }
}
}