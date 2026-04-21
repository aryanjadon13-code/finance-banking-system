import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Auth } from '../../services/auth';
import { BeneficiaryService } from '../../services/beneficiary-service/beneficiary-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email:string='';
  password:string='';

constructor (
  private router:Router ,
  private userService : UserService ,
  private authService : Auth,
  private beneficiaryService: BeneficiaryService
  ){}
 
forgotPassword() {
  alert("Forgot password feature will be implemented with backend");
}
    login() {
      this.userService.login(this.email , this.password).subscribe({
        next:(res)=>{
          console.log('=== LOGIN SUCCESSFUL ===');
          console.log('Token received, userId:', res.userId);
          this.authService.setUserSession(res.token, res.userId, res.email);
          console.log('User session set, syncing beneficiary cache...');
          this.beneficiaryService.syncCacheForCurrentUser();
          console.log('Navigating to dashboard');
          this.router.navigate(['/dashboard']);
        },
        error:(error)=>{
          console.error('Login error:', error);
        }
      })
    }
  }
