
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

register() {

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

  alert("Registration successful");

}
}