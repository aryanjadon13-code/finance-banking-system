import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  imports: [],
  templateUrl: './email-sent.html',
  styleUrl: './email-sent.css',
  standalone: true
})
export class EmailSent {

  constructor(private router:Router){}

  getToReset(){
this.router.navigate(['/verify-otp']);
  }

}
