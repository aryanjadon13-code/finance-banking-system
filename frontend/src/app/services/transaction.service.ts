import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Auth } from './auth';



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



   private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
  
}
