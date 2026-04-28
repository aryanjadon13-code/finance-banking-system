import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private auth: Auth) {}

  // ✅ Register
  register(name:string , email:string , phoneNumber:string , password:string , confirmPassword:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {name , email , phoneNumber , password , confirmPassword});
  }

  // ✅ Login
  login(email:string , password:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, {email , password});
  }

  // ✅ Forgot Password
  forgotPassword(email: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  // ✅ Verify OTP
  verifyOtp(email:string , otp:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email , otp });
  }

  // ✅ Reset Password
  resetPassword(email: string , newPassword:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email , newPassword });
  }

  // ✅ Get User by ID (Requires Auth)
  getUserById(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders()
    });
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });
  }
}
