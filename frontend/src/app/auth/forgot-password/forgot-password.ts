import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { Auth} from '../../services/auth'; 

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule , RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  standalone: true
})
export class ForgotPassword {
  email:string='';
  constructor ( private router:Router, private auth:Auth){}

  sendotp(){
    if(!this.email){
      alert('Please enter your email address');
      return;

      //store email in service
      this.auth.setEmail(this.email);
    }
    alert('OTP sent to your email address');
   console.log("clicked");
  this.router.navigate(['/email-sent']);
  }

}
