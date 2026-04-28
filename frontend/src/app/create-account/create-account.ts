import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-create-account',
  imports: [FormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',


})
export class CreateAccount {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private auth: Auth
  ) {}

accountType = '';
branch = '';
currency = 'INR - Indian Rupee (₹)';
initialDeposit = 0;
nomineeName = '';
nomineeRelation = '';
pin = '';
confirmPin = '';
createAccount() {

  if (
    !this.accountType ||
    !this.branch ||
    this.initialDeposit < 500 ||
    !this.nomineeName ||
    !this.nomineeRelation ||
    !this.pin ||
    this.pin !== this.confirmPin
  ) {
    alert('Please fill all required fields correctly');
    return;
  }

  const userId = this.auth.getUserId();
  if (!userId) {
    alert('User not logged in');
    return;
  }

  //SAVE ACCOUNT
  const account = {
    userId: parseInt(userId, 10),
    accountType: this.accountType,
    branchName: this.branch,
    initialDeposit: this.initialDeposit,
    nomineeName: this.nomineeName,
    nomineeRelation: this.nomineeRelation,
    pin: this.pin
  };

  this.accountService.createAccount(account).subscribe({
    next: (res) => {
      alert('Account created successfully');
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error(err);
      alert('Failed to create account. Please try again.');
    }
  });
}
}
