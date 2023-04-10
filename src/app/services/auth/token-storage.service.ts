import { Injectable } from '@angular/core';
import jwtDecode from "jwt-decode";
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'currentUser';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  public saveToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(refreshToken: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveUser(user: any): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  }
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (token !== null) {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = new Date().getTime();
      return expirationTime <= currentTime;
    }
    return true;
  }

  public getUser(): any {
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}
