import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-money',
  imports: [],
  templateUrl: './send-money.html',
  styleUrl: './send-money.css',
})
export class SendMoney {
  constructor(public router: Router) {
  }

}
