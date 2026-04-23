import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class Payments {

  selectedUser = '';
  amount: number | null = null;
  note = '';

  // dummy beneficiaries
  users = [
    { name: 'Rahul' },
    { name: 'Priya' },
    { name: 'Aman' }
  ];

  constructor(private router: Router) {}
  ngOnInit() {
  this.loadBeneficiaries();
}

loadBeneficiaries() {
  
  //dummy 
  this.users = [
    { name: 'Rahul Sharma' },
    { name: 'Priya Verma' }
  ];

  
}

  
  

  goToPin() {
    if (!this.selectedUser || !this.amount) {
      alert('Fill all fields');
      return;
    }

    

    // Save temporarily
    const paymentData = {
      user: this.selectedUser,
      amount: this.amount,
      note: this.note
    };

    

    localStorage.setItem('payment', JSON.stringify(paymentData));

    // redirect to PIN page (next step)
    this.router.navigate(['/dashboard/enter-pin']);
  }
}