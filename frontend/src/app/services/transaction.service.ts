import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Auth } from './auth';



@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly baseUrl = 'http://localhost:8083/api/transactions/user';

  constructor(private authService : Auth , private http : HttpClient){}



  getTransaction(userId:number , page : number){
     let params = new HttpParams()
    .set('page', page.toString());

    return  this.http.get(`${this.baseUrl}/${userId}`   ,{ params})
  }



   private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
  
}
