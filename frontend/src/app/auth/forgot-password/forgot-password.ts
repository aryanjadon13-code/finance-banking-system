import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { log } from 'console';

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
   console.log("clicked");
  this.router.navigate(['/email-sent']);
  }

}
