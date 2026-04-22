import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BeneficiaryResponse, BeneficiaryService } from '../../services/beneficiary-service/beneficiary-service';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './beneficiaries.html',
  styleUrl: './beneficiaries.css',
})
export class Beneficiaries implements OnInit, OnDestroy {
  beneficiaries: BeneficiaryResponse[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  private beneficiariesSubscription?: Subscription;

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    console.log('=== BENEFICIARIES PAGE INIT ===');
    this.successMessage = history.state?.successMessage || '';

    // Step 1: Sync cache
    this.beneficiaryService.syncCacheForCurrentUser();

    // Step 2: Subscribe to observable
    this.beneficiariesSubscription = this.beneficiaryService.beneficiaries$.subscribe((beneficiaries) => {
      console.log('→ Observable updated with', beneficiaries.length, 'items');
      this.beneficiaries = beneficiaries;

      // IMPORTANT: stop loading if data comes
     this.beneficiaries=beneficiaries;
     this.loading=false;
    });

    // Step 3: Load cached data first
    // const cached = this.beneficiaryService.getCurrentBeneficiaries();
    // console.log('Cached items:', cached.length);

    // if (cached.length > 0) {
    //   this.beneficiaries = cached;
    //   this.loading = false;
    // }

    // Step 4: Fetch fresh data (without hiding UI)
    this.loadBeneficiaries();
  }

  ngOnDestroy(): void {
    this.beneficiariesSubscription?.unsubscribe();
  }

  loadBeneficiaries() {
    console.log('loadBeneficiaries called');

    // only show loader if no data exists
    if (this.beneficiaries.length === 0) {
      this.loading = true;
    }

    this.errorMessage = '';

    this.beneficiaryService.getBeneficiaries().subscribe({
      next: (beneficiaries) => {
        console.log('API success:', beneficiaries.length);
        this.beneficiaryService.setBeneficiaries(beneficiaries);
        this.loading = false;
      },
      error: (error) => {
        console.error('API error:', error);
        this.loading = false;
        this.errorMessage = this.extractError(error);
      }
    });
  }

  deleteBeneficiary(id: number) {
    this.errorMessage = '';

    this.beneficiaryService.deleteBeneficiary(id).subscribe({
      next: () => {
        this.successMessage = 'Beneficiary deleted successfully.';
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

    return 'Unable to load beneficiaries right now.';
  }
}