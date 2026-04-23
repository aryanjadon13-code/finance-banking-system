import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  //  Dynamic data (API ready)
  securitySettings = [
    {
      title: ' Two-Factor Authentication',
      desc: 'OTP required on every login',
      enabled: true,
      icon: 'fa-lock'
    },
    {
      title: 'Biometric Login',
      desc: 'Fingerprint or Face ID',
      enabled: false,
      icon: 'fa-fingerprint'
    },
    // {
    //   title: 'Auto Session Logout',
    //   desc: 'Logout after 10 min idle',
    //   enabled: true,
    //   icon: 'fa-clock'
    // }
  ];

  notificationsSettings = [
  {
    icon: 'fa-bell',
    title: 'Transaction Alerts',
    desc: 'SMS alert on every payment',
    enabled: true
  },
  // {
  //   icon: 'fa-file-invoice',
  //   title: 'Bill Due Reminders',
  //   desc: '3 days before due date',
  //   enabled: true
  // },
  {
    icon: 'fa-envelope',
    title: 'Email Notifications',
    desc: 'Mirror of all SMS alerts',
    enabled: false
  }
];

accountSettings = [
  {
    icon: 'fa-key',
    title: 'Change Password',
    desc: 'Update your login password',
    action: 'navigate'
  },
  {
    icon: 'fa-hashtag',
    title: 'Change MPIN',
    desc: '4-digit transaction PIN',
    action: 'navigate',
    highlight: true
  },
  {
    icon: 'fa-file-alt',
    title: 'KYC Documents',
    desc: 'View your uploaded documents',
    status: 'Verified'
  },
  
  {
    icon: 'fa-comment-dots',
    title: 'Help & Support',
    desc: 'Chat or raise a support ticket',
    action: 'navigate'
  }
];

}


