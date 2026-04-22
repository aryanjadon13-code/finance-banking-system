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
   errorMessage:string='';

   constructor(private router:Router, private authService:Auth , private userService : UserService){}
   
   

    resetPassword() {

    this.errorMessage = '';

    // ✅ Required check
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = "Please fill all the fields";
      return;
    }

    // ✅ Strong password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(this.newPassword)) {
      this.errorMessage =
        "Password must be strong (min 6 chars, 1 uppercase, 1 number, 1 special char)";
      return;
    }

    // ✅ Match check
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    // ✅ Get email from session
    const email = this.authService.getForgotPasswordEmail();
    console.log("Email for password reset:", email);

    if (!email) {
      this.errorMessage = "Session expired. Please start again.";
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

        this.errorMessage =err?.error?.message || "something went wrong";

      }
    })
   }
}
