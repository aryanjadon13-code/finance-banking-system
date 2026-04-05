import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
   newPassword:string='';
   confirmPassword:string='';

   constructor(private router:Router, private auth:Auth){}

   resetPassword(){
    if(!this.newPassword || !this.confirmPassword ){
      alert("Please fill all the fields");
      return;
    }
    if(this.newPassword !== this.confirmPassword){
      alert("Passwords do not match");
      return;
    }
     const email = this.auth.getEmail();
     console.log("Email for password reset:", email);

     if(!email){
      alert("Session expired. Please start the process again.");
      this.router.navigate(['/forgot-password']);
      return;
     }

    alert("Password reset successful");

    //clean email from service
    this.auth.clearEmail();
    
    this.router.navigate(['/login']);
   }
}
