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

  // ✅ FORM
  form: BeneficiaryRequest = {
    name: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  };

  // ✅ UI STATE
  loading = false;
  successMessage = '';
  errorMessage = '';

  // ✅ NEW: BRANCH DATA (yaha hona chahiye, NOT inside subscribe)
  branches = [
    { name: 'SBI - Delhi', ifsc: 'SBIN0001234' },
    { name: 'HDFC - Mumbai', ifsc: 'HDFC0005678' },
    { name: 'ICICI - Bangalore', ifsc: 'ICIC0009012' },
    {name: 'PNB - Indore',ifsc:'PNB0004589'},
    {name: 'Central-Bhopal',ifsc:'CEN0004695'},
    
  ];

  selectedBranch = '';

  constructor(
    private beneficiaryService: BeneficiaryService,
    private router: Router
  ) {}

  onBranchChange() {
  const branch = this.branches.find(b => b.name === this.selectedBranch);

  if (branch) {
    this.form.ifscCode = branch.ifsc;   
    this.form.bankName = branch.name;  
  } else {
    this.form.ifscCode = '';
    this.form.bankName = '';
  }
}

  addBeneficiary() {
    if (this.loading) return;

    this.successMessage = '';
    this.errorMessage = '';

    // ✅ TRIM + FORMAT
    this.form = {
      name: this.form.name.trim(),
      accountNumber: this.form.accountNumber.trim(),
      bankName: this.form.bankName.trim(),
      ifscCode: this.form.ifscCode.trim().toUpperCase(),
    };

    // ✅ REQUIRED CHECK
    if (!this.form.name || !this.form.accountNumber || !this.form.bankName || !this.form.ifscCode) {
      this.errorMessage = 'Please fill all beneficiary details.';
      return;
    }

    // ✅ ACCOUNT VALIDATION
    if (!/^[0-9]{9,18}$/.test(this.form.accountNumber)) {
      this.errorMessage = 'Account number must be 9–18 digits.';
      return;
    }

    // ✅ IFSC VALIDATION
    if (!/^[A-Z]{4}0[0-9]{6}$/.test(this.form.ifscCode)) {
      this.errorMessage = 'Invalid IFSC format (Example: SBIN0001234)';
      return;
    }

    // ✅ DUPLICATE CHECK
    const existingBeneficiary = this.beneficiaryService
      .getCurrentBeneficiaries()
      .find(b => b.accountNumber === this.form.accountNumber);

    if (existingBeneficiary) {
      this.errorMessage = 'User with this account number already exists';
      return;
    }

    this.loading = true;

    this.beneficiaryService.addBeneficiary(this.form)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (savedBeneficiary) => {

          // ✅ RESET FORM
          this.form = {
            name: '',
            accountNumber: '',
            bankName: '',
            ifscCode: '',
          };
          this.selectedBranch = '';

          // ✅ NAVIGATION
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
    if (typeof error?.error === 'string') return error.error;

    if (error?.error?.message) return error.error.message;

    if (error?.error && typeof error.error === 'object') {
      const firstError = Object.values(error.error)[0];
      if (typeof firstError === 'string') return firstError;
    }

    return 'Unable to add beneficiary right now.';
  }
}