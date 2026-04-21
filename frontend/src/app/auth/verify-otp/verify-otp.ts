import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { UserService } from '../../services/user-service';

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

  constructor(private router: Router, private authService: Auth , private userService : UserService) {}

  verifyOtp() {
    const email = this.authService.getForgotPasswordEmail();
    if(email === ""){
      this.authService.clear();
      this.router.navigate(['/login']);
      return;
    }
    const otpString = this.otp.join('');
    console.log(otpString);
    this.userService.verifyOtp(email , otpString).subscribe({
      next:()=>{
        console.log("Otp verified successfully!");
        this.router.navigate(['/reset-password']);

      },
      error:(err)=>{
        console.log("failed to verify !" , err); 

      }
    })
  }



  moveFocus(event: any, nextElement: HTMLInputElement | null): void {
  const currentInput = event.target as HTMLInputElement;
  const isBackspace = event.key === 'Backspace';

  // Move forward if a value is entered
  if (currentInput.value && nextElement) {
    nextElement.focus();
  }

  // Move backward if backspace is pressed
  if (isBackspace) {
    const previousElement = currentInput.previousElementSibling as HTMLInputElement;
    if (previousElement) {
      previousElement.focus();
    }
  }
}
}
