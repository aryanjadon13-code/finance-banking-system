import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = 'http://localhost:8080/api/accounts';

  constructor(private authService: Auth, private http: HttpClient) {}

  createAccount(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.buildHeaders()
    });
  }

  getAccountsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`, {
      headers: this.buildHeaders()
    });
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
}
