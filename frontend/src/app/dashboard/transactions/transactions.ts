import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {

  constructor(
    private transactionService : TransactionService,
    private authService : Auth,
    private cdr : ChangeDetectorRef
  ){}

  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;
  currentPage = 0;
  title = "";

  transactions : any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    const userId = Number(this.authService.getUserId());
    this.transactionService.getTransaction(userId , this.currentPage).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.transactions =[...res.data]
        this.cdr.detectChanges();

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
}