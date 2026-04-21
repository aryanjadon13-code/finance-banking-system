import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Auth } from '../auth';

export interface BeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

export interface BeneficiaryResponse {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  userId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  private readonly baseUrl = 'http://localhost:8080/api/beneficiaries';
  private readonly beneficiariesSubject = new BehaviorSubject<BeneficiaryResponse[]>([]);

  readonly beneficiaries$ = this.beneficiariesSubject.asObservable();
  private cacheInitialized = false;

  constructor(private http: HttpClient, private authService: Auth) {
    // Don't initialize cache in constructor - do it lazily when needed
    console.log('BeneficiaryService initialized');
  }

  private ensureCacheLoaded(): void {
    // Load cache from localStorage and update the subject
    console.log('Ensuring cache is loaded...');
    const cached = this.readStoredBeneficiaries();
    this.beneficiariesSubject.next(cached);
    this.cacheInitialized = true;
  }

  addBeneficiary(payload: BeneficiaryRequest): Observable<BeneficiaryResponse> {
    return this.http.post<BeneficiaryResponse>(this.baseUrl, payload, {
      headers: this.buildHeaders()
    }).pipe(
      tap((beneficiary) => {
        this.addBeneficiaryToState(beneficiary);
      })
    );
  }

  getBeneficiaries(): Observable<BeneficiaryResponse[]> {
    console.log('getBeneficiaries called');
    // Ensure cache is loaded first
    if (!this.cacheInitialized) {
      this.ensureCacheLoaded();
    }
    
    return this.http.get<BeneficiaryResponse[]>(this.baseUrl, {
      headers: this.buildHeaders()
    }).pipe(
      tap((beneficiaries) => {
        console.log('API returned', beneficiaries.length, 'beneficiaries');
        this.beneficiariesSubject.next(beneficiaries);
        this.storeBeneficiaries(beneficiaries);
      })
    );
  }

  refreshBeneficiaries(): Observable<BeneficiaryResponse[]> {
    return this.getBeneficiaries();
  }

  deleteBeneficiary(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders()
    }).pipe(
      tap(() => {
        this.removeBeneficiaryFromState(id);
      })
    );
  }

  setBeneficiaries(beneficiaries: BeneficiaryResponse[]) {
    this.beneficiariesSubject.next(beneficiaries);
    this.storeBeneficiaries(beneficiaries);
  }

  addBeneficiaryToState(beneficiary: BeneficiaryResponse) {
    const current = this.beneficiariesSubject.getValue();
    const updated = [beneficiary, ...current.filter((item) => item.id !== beneficiary.id)];
    this.beneficiariesSubject.next(updated);
    this.storeBeneficiaries(updated);
  }

  removeBeneficiaryFromState(id: number) {
    const current = this.beneficiariesSubject.getValue();
    const updated = current.filter((beneficiary) => beneficiary.id !== id);
    this.beneficiariesSubject.next(updated);
    this.storeBeneficiaries(updated);
  }

  getCurrentBeneficiaries(): BeneficiaryResponse[] {
    const current = this.beneficiariesSubject.getValue();
    console.log('getCurrentBeneficiaries: returning', current.length, 'beneficiaries');
    return current;
  }

  clearBeneficiaries() {
    this.beneficiariesSubject.next([]);
    localStorage.removeItem(this.getStorageKey());
  }

  reloadCacheFromStorage(): void {
    // Public method to force reload cache from localStorage
    const cached = this.readStoredBeneficiaries();
    this.beneficiariesSubject.next(cached);
  }

  debugStorageState(): void {
    const userId = this.authService.getUserId();
    console.group('Beneficiary Service Debug');
    console.log('Current userId from Auth:', userId);
    console.log('Storage key that would be used:', this.getStorageKey());
    
    // Check all possible keys in localStorage
    console.log('All beneficiary-related keys in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('beneficiaries')) {
        const value = localStorage.getItem(key);
        console.log(`  ${key}: ${value ? JSON.parse(value).length + ' items' : 'null'}`);
      }
    }
    
    console.log('Current subject value:', this.beneficiariesSubject.getValue().length, 'items');
    console.groupEnd();
  }

  syncCacheForCurrentUser() {
    console.log('syncCacheForCurrentUser called');
    // Clear old guest cache if user is now logged in
    const currentUserId = this.authService.getUserId();
    console.log('Current userId in syncCacheForCurrentUser:', currentUserId);
    
    if (currentUserId && localStorage.getItem('beneficiaries_guest')) {
      console.log('Removing guest cache because user is logged in');
      localStorage.removeItem('beneficiaries_guest');
    }
    
    // Force reload cache with the new userId
    this.ensureCacheLoaded();
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  private readStoredBeneficiaries(): BeneficiaryResponse[] {
    try {
      const userId = this.authService.getUserId();
      console.log('readStoredBeneficiaries: userId from Auth service:', userId);
      
      // If user is logged in, prioritize user-specific key
      if (userId) {
        const userStorageKey = `beneficiaries_${userId}`;
        console.log('Looking for user-specific key:', userStorageKey);
        const userStored = localStorage.getItem(userStorageKey);
        if (userStored) {
          try {
            const parsed = JSON.parse(userStored) as BeneficiaryResponse[];
            console.log(`✓ Found ${parsed.length} beneficiaries with key: ${userStorageKey}`);
            return parsed;
          } catch (e) {
            console.error(`Failed to parse beneficiaries from ${userStorageKey}`, e);
            localStorage.removeItem(userStorageKey);
          }
        } else {
          console.log(`✗ No data found with key: ${userStorageKey}`);
        }
      } else {
        console.warn('userId is empty/null');
      }

      // If user-specific key didn't work, search all localStorage for beneficiary data
      console.log('Searching all localStorage keys for beneficiary data...');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('beneficiaries_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored) as BeneficiaryResponse[];
              console.log(`✓ Found ${parsed.length} beneficiaries with fallback key: ${key}`);
              return parsed;
            } catch (e) {
              console.error(`Failed to parse beneficiaries from ${key}`, e);
            }
          }
        }
      }

      // Fallback to guest key if no user data found
      console.log('Checking guest key...');
      const guestStored = localStorage.getItem('beneficiaries_guest');
      if (guestStored) {
        try {
          const parsed = JSON.parse(guestStored) as BeneficiaryResponse[];
          console.log(`✓ Found ${parsed.length} guest beneficiaries`);
          return parsed;
        } catch (e) {
          console.error('Failed to parse guest beneficiaries', e);
          localStorage.removeItem('beneficiaries_guest');
        }
      }

      // Legacy migration
      const legacyStored = localStorage.getItem('beneficiaries');
      if (legacyStored) {
        try {
          const parsed = JSON.parse(legacyStored) as BeneficiaryResponse[];
          const currentKey = this.getStorageKey();
          localStorage.setItem(currentKey, legacyStored);
          localStorage.removeItem('beneficiaries');
          console.log('Migrated legacy beneficiaries to:', currentKey);
          return parsed;
        } catch (e) {
          console.error('Failed to migrate legacy beneficiaries', e);
          localStorage.removeItem('beneficiaries');
        }
      }

      console.log('✗ No beneficiaries found in localStorage');
      return [];
    } catch (e) {
      console.error('Error reading stored beneficiaries', e);
      return [];
    }
  }

  private storeBeneficiaries(beneficiaries: BeneficiaryResponse[]) {
    const storageKey = this.getStorageKey();
    console.log(`Storing ${beneficiaries.length} beneficiaries with key: ${storageKey}`);
    localStorage.setItem(storageKey, JSON.stringify(beneficiaries));
  }

  private getStorageKey(): string {
    const userId = this.authService.getUserId();
    const key = userId ? `beneficiaries_${userId}` : 'beneficiaries_guest';
    console.log('Beneficiary storage key:', key);
    return key;
  }
}
