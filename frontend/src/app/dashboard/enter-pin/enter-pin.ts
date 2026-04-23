import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enter-pin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enter-pin.html',
  styleUrls: ['./enter-pin.css']
})
export class EnterPinComponent {

  enteredPin = '';

  constructor(private router: Router) {}

  verifyPin() {

    const account = JSON.parse(localStorage.getItem('account') || '{}');

    if (this.enteredPin === account.pin) {
      alert('Payment Successful ');

      //  next redirect
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid PIN ');
    }
  }
}