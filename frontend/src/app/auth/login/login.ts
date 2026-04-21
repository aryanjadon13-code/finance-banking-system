import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Auth } from '../../services/auth';

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

constructor (private router:Router , private userService : UserService , private authService : Auth  ){}
 
forgotPassword() {
  alert("Forgot password feature will be implemented with backend");
}
    login() {


      this.userService.login(this.email , this.password).subscribe({
        next:(res)=>{
          console.log(res);
          this.authService.setToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error:(error)=>{

          console.log("error : " , error)
        }
      })

    }
  }
