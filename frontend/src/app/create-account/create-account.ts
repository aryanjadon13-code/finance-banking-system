import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-account',
  imports: [FormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',


})
export class CreateAccount {
  constructor( private router: Router) {}

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

  
  //SAVE ACCOUNT
  const account = {
    type: this.accountType,
    branch: this.branch,
    balance: this.initialDeposit,
    nominee: this.nomineeName,
    relation: this.nomineeRelation,
    pin: this.pin   // SAVE HO RAHA HAI
  };

  localStorage.setItem('account', JSON.stringify(account));

  // success message
  alert('Account created successfully ');

  // redirect
  this.router.navigate(['/dashboard']);
}
}
