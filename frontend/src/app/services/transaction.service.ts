import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly baseUrl = 'http://localhost:8080/api/transactions/user';

  constructor(private authService : Auth , private http : HttpClient){}

  getTransaction(userId:number , page : number , searchText:string , selectedType:string , selectedMonth:string){
     let params = new HttpParams()
    .set('page', page.toString())
    .set("searchText" , searchText)
    .set("selectedType" , selectedType)
    .set("selectedMonth" , selectedMonth);

    return  this.http.get(`${this.baseUrl}/${userId}`, {
      headers: this.buildHeaders(),
      params : params
    })
  }



  transfer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl.replace('/user', '')}/transfer`, data, {
      headers: this.buildHeaders()
    });
  }

   private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
  
}
