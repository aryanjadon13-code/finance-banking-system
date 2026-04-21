import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BeneficiaryRequest, BeneficiaryService } from '../../services/beneficiary-service/beneficiary-service';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-beneficiary.html',
  styleUrl: './add-beneficiary.css',
})
export class AddBeneficiary {
  form: BeneficiaryRequest = {
    name: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private beneficiaryService: BeneficiaryService,
    private router: Router
  ) {}

  addBeneficiary() {
    if (this.loading) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.form = {
      name: this.form.name.trim(),
      accountNumber: this.form.accountNumber.trim(),
      bankName: this.form.bankName.trim(),
      ifscCode: this.form.ifscCode.trim().toUpperCase(),
    };

    if (!this.form.name || !this.form.accountNumber || !this.form.bankName || !this.form.ifscCode) {
      this.errorMessage = 'Please fill all beneficiary details.';
      return;
    }

    const existingBeneficiary = this.beneficiaryService
      .getCurrentBeneficiaries()
      .find((beneficiary) => beneficiary.accountNumber === this.form.accountNumber);

    if (existingBeneficiary) {
      this.errorMessage = 'User with this account number already exists';
      return;
    }

    this.loading = true;
    const payload = {
      ...this.form,
    };

    this.beneficiaryService.addBeneficiary(payload)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (savedBeneficiary) => {
          this.successMessage = 'Beneficiary added successfully.';
          this.form = {
            name: '',
            accountNumber: '',
            bankName: '',
            ifscCode: '',
          };

          this.router.navigate(['/dashboard/beneficiaries'], {
            state: {
              successMessage: 'Beneficiary added successfully.',
              savedBeneficiary
            }
          });
        },
        error: (error) => {
          this.errorMessage = this.extractError(error);
        }
      });
  }

  private extractError(error: any): string {
    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.error && typeof error.error === 'object') {
      const firstError = Object.values(error.error)[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    return 'Unable to add beneficiary right now.';
  }
}
