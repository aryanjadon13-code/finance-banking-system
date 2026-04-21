import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
   newPassword:string='';
   confirmPassword:string='';

   constructor(private router:Router, private authService:Auth , private userService : UserService){}

   resetPassword(){
    if(!this.newPassword || !this.confirmPassword ){
      alert("Please fill all the fields");
      return;
    }
    if(this.newPassword !== this.confirmPassword){
      alert("Passwords do not match");
      return;
    }
     const email = this.authService.getForgotPasswordEmail();
     console.log("Email for password reset:", email);

     if(!email){
      alert("Session expired. Please start the process again.");
      this.router.navigate(['/forgot-password']);
      return;
     }

    this.userService.resetPassword(email , this.newPassword).subscribe({
      next:()=>{
        console.log("password reset successfull!");
        this.router.navigate(['/login']);
      },
      error:(err)=>{
        console.log("failed to reset the password!" , err);

      }
    })
   }
}
