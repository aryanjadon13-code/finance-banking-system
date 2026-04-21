import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { Auth} from '../../services/auth'; 
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule , RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  standalone: true
})
export class ForgotPassword {
  email:string='';
  constructor ( private router:Router, private authService:Auth , private userService : UserService){}

  forgetPassword(){
    this.userService.forgotPassword(this.email).subscribe({
      next:()=>{
        this.authService.setForgotPasswordEmail(this.email);
        console.log("Otp sent to your email !");
        this.router.navigate(['/email-sent'])
      },
      error:(err)=>{
        console.log("failed to generate otp!" , err);
      }

    })
  }

}
