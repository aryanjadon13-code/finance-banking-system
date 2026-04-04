import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
   newPassword:string='';
   confirmPassword:string='';

   constructor(private router:Router){}

   resetPassword(){
    if(!this.newPassword || !this.confirmPassword ){
      alert("Please fill all the fields");
      return;
    }
    if(this.newPassword !== this.confirmPassword){
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successful");
    this.router.navigate(['/login']);
   }
}
