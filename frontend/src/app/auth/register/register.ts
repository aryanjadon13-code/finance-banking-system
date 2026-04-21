import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  // ✅ ADD THIS
  constructor(private router: Router , private userService : UserService) {}

  register() {

    this.userService.register(this.name , this.email , this.phone , this.password , this.confirmPassword).subscribe({
      next:(res)=>{
        console.log(res);
      } , 
      error :(err)=>{
        console.log(err);
      }
    });





    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      accountNumber: "1234567890",
      balance: 50000
    };

    localStorage.setItem('user', JSON.stringify(user));

    alert('Registration successful! Please login.');

    //direct to login page after registration
    this.router.navigate(['/login']);
  }
}

