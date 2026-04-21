import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
   
  setToken(token:any){
    localStorage.setItem("token" , token);
  }

  getToken(){
    return localStorage.getItem("token") || "";
  }

  setForgotPasswordEmail(email: string){
    localStorage.setItem("email", email);
  }



  getForgotPasswordEmail(){
    return localStorage.getItem("email") || "";
  }

  clearEmail(){

  }

  clear(){
    localStorage.clear();
  }

  isUserLoggedIn(){
    return this.getToken() ;
  }
}
