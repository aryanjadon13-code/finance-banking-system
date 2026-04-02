import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { Router, RouterLink } from '@angular/router';

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

constructor (private router:Router){}
 
forgotPassword() {
  alert("Forgot password feature will be implemented with backend");
}
    login() {


      const storedUser=JSON.parse(localStorage.getItem('user')||'{}');

      if(this.email===storedUser.email&& this.password==storedUser.password){
        alert("login successful");
        this.router.navigate(['/dashboard']);
      }else{
        alert("Invalid email or password");

        
      }
    }
  }
