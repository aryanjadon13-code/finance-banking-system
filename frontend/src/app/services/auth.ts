import { Injectable } from '@angular/core';

interface JwtPayload {
  userId?: number | string;
  sub?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly tokenKey = 'token';
  private readonly forgotPasswordEmailKey = 'email';
  private readonly userIdKey = 'userId';
  private readonly userEmailKey = 'userEmail';

  // ================= TOKEN =================

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || "";
  }

  // ================= SESSION =================

  setUserSession(token: string, userId: number | string, email: string) {
    this.setToken(token);
    localStorage.setItem(this.userIdKey, String(userId));
    localStorage.setItem(this.userEmailKey, email);
  }

  // ================= USER ID =================

  getUserId(): string {
    const storedUserId = localStorage.getItem(this.userIdKey);

    if (storedUserId) {
      console.log('Auth.getUserId(): Found stored userId:', storedUserId);
      return storedUserId;
    }

    const payload = this.getTokenPayload();
    const userId = payload?.userId;

    if (userId !== undefined && userId !== null) {
      const normalizedUserId = String(userId);
      console.log('Auth.getUserId(): Parsed from token:', normalizedUserId);
      localStorage.setItem(this.userIdKey, normalizedUserId);
      return normalizedUserId;
    }

    console.warn('Auth.getUserId(): No userId found');
    return '';
  }

  // ================= USER EMAIL =================

  getUserEmail(): string {
    const storedUserEmail = localStorage.getItem(this.userEmailKey);

    if (storedUserEmail) {
      return storedUserEmail;
    }

    const payload = this.getTokenPayload();
    const email = payload?.sub;

    if (typeof email === 'string' && email) {
      localStorage.setItem(this.userEmailKey, email);
      return email;
    }

    return '';
  }

  // ================= FORGOT PASSWORD =================

  setForgotPasswordEmail(email: string) {
    localStorage.setItem(this.forgotPasswordEmailKey, email);
  }

  getForgotPasswordEmail(): string {
    return localStorage.getItem(this.forgotPasswordEmailKey) || "";
  }

  // ================= CLEAR =================

  clear() {
    localStorage.clear();
  }

  clearEmail() {
    localStorage.removeItem(this.forgotPasswordEmailKey);
  }

  // ================= AUTH CHECK =================

  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= JWT PARSER =================

  private getTokenPayload(): JwtPayload | null {
    const token = this.getToken();

    if (!token) {
      console.warn('No token available');
      return null;
    }

    const parts = token.split('.');

    if (parts.length < 2) {
      console.warn('Invalid token format');
      return null;
    }

    try {
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decoded = atob(payload);
      const parsed = JSON.parse(decoded) as JwtPayload;

      console.log('Decoded token payload:', parsed);
      return parsed;

    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}