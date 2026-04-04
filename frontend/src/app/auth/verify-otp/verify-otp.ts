import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class verifyOtp {

  // Store 6 digit OTP
  otp: string[] = ['', '', '', '', '', ''];

  constructor(private router: Router) {}

  verifyOtp() {

    // Check if any box is empty
    if (this.otp.includes('')) {
      alert("Please enter complete OTP");
      return;
    }

    // Combine OTP digits
    const finalOtp = this.otp.join('');

    console.log("Entered OTP:", finalOtp);

    // Demo success
    alert("OTP Verified");

    // Navigate to reset password
    this.router.navigate(['/reset-password']);
  }
}