import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule , RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  standalone: true
})
export class ForgotPassword {
  email:string='';
  constructor(private router:Router){}

  sendotp(){
    if(!this.email){
      alert('Please enter your email address');
      return;
    }
    alert('OTP sent to your email address');
   this.router.navigate(['/verify-otp']);
  }

}
