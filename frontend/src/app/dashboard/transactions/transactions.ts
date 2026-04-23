import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {

  constructor(
    private transactionService : TransactionService,
    private authService : Auth,
    private cdr : ChangeDetectorRef
  ){}

  searchText = "";
  selectedType = "all";
  selectedMonth = "all";
  
  currentPage = 0;

  transactions : any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    const userId = Number(this.authService.getUserId());
    this.transactionService.getTransaction(userId , this.currentPage , this.searchText , this.selectedType , this.selectedMonth).subscribe({
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


  onFilterChange(){
    this.loadData();
    this.cdr.detectChanges();
  }

}