import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { BeneficiaryService, BeneficiaryResponse } from '../../services/beneficiary-service/beneficiary-service';
import { TransactionService } from '../../services/transaction.service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './send-money.html',
  styleUrl: './send-money.css',
})
export class SendMoney implements OnInit {
  transferForm: FormGroup;
  accounts: any[] = [];
  beneficiaries: BeneficiaryResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private accountService: AccountService,
    private beneficiaryService: BeneficiaryService,
    private transactionService: TransactionService,
    private auth: Auth,
    private cdRef: ChangeDetectorRef
  ) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      description: [''],
      selectedBeneficiary: [null]
    });
  }

  ngOnInit() {
    console.log('SendMoney Component Initialized');
    const userId = this.auth.getUserId();
    if (!userId) {
      console.warn('No userId found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Fetching data for userId:', userId);
    this.loadData(userId);

    // Watch for beneficiary selection changes
    this.transferForm.get('selectedBeneficiary')?.valueChanges.subscribe(beneficiary => {
      if (beneficiary) {
        console.log('Beneficiary selected:', beneficiary);
        this.transferForm.patchValue({
          toAccount: beneficiary.accountNumber,
          description: `Transfer to ${beneficiary.name}`
        });
        this.cdRef.detectChanges();
      }
    });
  }

  loadData(userId: string) {
    this.isLoading = true;
    
    // Load accounts
    this.accountService.getAccountsByUserId(userId).subscribe({
      next: (res: any) => {
        console.log('Accounts loaded:', res);
        this.accounts = res || [];
        if (this.accounts.length > 0) {
          this.transferForm.patchValue({ fromAccount: this.accounts[0].accountNumber });
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load accounts', err);
        this.errorMessage = 'Could not load your accounts. Please check your connection.';
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });

    // Load beneficiaries
    this.beneficiaryService.getBeneficiaries().subscribe({
      next: (res: any) => {
        console.log('Beneficiaries loaded:', res);
        this.beneficiaries = res || [];
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load beneficiaries', err);
        this.cdRef.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.transferForm.invalid) {
      this.markFormGroupTouched(this.transferForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      fromAccount: this.transferForm.value.fromAccount,
      toAccount: this.transferForm.value.toAccount,
      amount: this.transferForm.value.amount,
      pin: this.transferForm.value.pin,
      description: this.transferForm.value.description || 'Fund Transfer'
    };

    console.log('Submitting transfer:', payload);

    this.transactionService.transfer(payload).subscribe({
      next: (res: any) => {
        console.log('Transfer success:', res);
        this.isLoading = false;
        this.successMessage = 'Transfer successful!';
        this.cdRef.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Transfer failed. Please check your balance and PIN.';
        console.error('Transfer error', err);
        this.cdRef.detectChanges();
      }
    });
  }

  getSelectedAccount() {
    const accNo = this.transferForm.get('fromAccount')?.value;
    return this.accounts.find(a => a.accountNumber === accNo);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
