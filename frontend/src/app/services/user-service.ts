import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  // ✅ Register
  register(name:string , email:string , phone:string , password:string , confirmPassword:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {name , email , phone , password , confirmPassword});
  }

  // ✅ Login
  login(email:string , password:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, {email , password});
  }

  // ✅ Forgot Password
  forgotPassword(email: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }
  // ✅ Forgot Password
  verifyOtp(email:string , otp:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email , otp });
  }
  // ✅ Forgot Password
  resetPassword(email: string , newPassword:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email , newPassword });
  }
}