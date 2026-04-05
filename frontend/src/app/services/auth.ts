import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
   private email:string='';


   //store email in service
   setEmail(email:string){
    this.email=email;
   }

   //get email from service
   getEmail():string{
    return this.email;
   }

   //clear email from service
   clearEmail(){
    this.email='';
   }
}
