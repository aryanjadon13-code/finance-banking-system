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

  constructor(private router: Router, private userService: UserService) {}

  register() {

    //  Name validation
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(this.name)) {
      alert('Name should contain only letters');
      return;
    }

    //  Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.phone)) {
      alert('Phone number must be 10 digits');
      return;
    }

    //  Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Enter valid email');
      return;
    }

    //  Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(this.password)) {
      alert('Password must be strong (1 uppercase, 1 number, 1 special char)');
      return;
    }

    //  Confirm password
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // API CALL (backend integration)
    this.userService.register(
      this.name,
      this.email,
      this.phone,
      this.password,
      this.confirmPassword
    ).subscribe({
      next: (res) => {
        console.log('Success:', res);

        //  Save user locally (temporary)
        const user = {
          name: this.name,
          email: this.email,
          phone: this.phone
        };

        localStorage.setItem('user', JSON.stringify(user));

        alert('Registration successful!');

       

    //  ALWAYS go to login
    this.router.navigate(['/login']);
  },
      error: (err) => {
        console.log('Error:', err);
        alert('Registration failed!');
      }
    });
  }
}