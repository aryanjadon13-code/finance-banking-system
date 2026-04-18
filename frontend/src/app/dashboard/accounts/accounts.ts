import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accounts',
  imports: [RouterLink],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
 comingSoonMessage = '';
showToast = false;

showComingSoon(feature: string) {
  this.comingSoonMessage = `${feature} feature coming soon 🚧`;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 2000);
}
}
