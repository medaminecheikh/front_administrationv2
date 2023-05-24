import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import jwtDecode from "jwt-decode";
import {SECRET_KEY} from "../../guards/constants";
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'currentUser';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }
  public saveToken(token: string): void {
    const encryptedToken = AES.encrypt(token,SECRET_KEY ).toString();
    sessionStorage.setItem(TOKEN_KEY, encryptedToken);
  }

  public getToken(): string | null {
    const encryptedToken = sessionStorage.getItem(TOKEN_KEY);
    if (encryptedToken) {
      const decryptedToken = AES.decrypt(encryptedToken, SECRET_KEY).toString(enc.Utf8);
      return decryptedToken || null;
    }
    return null;
  }

  public saveRefreshToken(refreshToken: string): void {
    const encryptedRefreshToken = AES.encrypt(refreshToken, SECRET_KEY).toString();
    sessionStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefreshToken);
  }

  public getRefreshToken(): string | null {
    const encryptedRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (encryptedRefreshToken) {
      const decryptedRefreshToken = AES.decrypt(encryptedRefreshToken, SECRET_KEY).toString(enc.Utf8);
      return decryptedRefreshToken || null;
    }
    return null;
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
  public saveUser(user: any): void {
    const encryptedUser = AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
    sessionStorage.setItem(USER_KEY, encryptedUser);
  }

  public getUser(): any {
    const encryptedUser = sessionStorage.getItem(USER_KEY);
    if (encryptedUser) {
      const decryptedUser = AES.decrypt(encryptedUser, SECRET_KEY).toString(enc.Utf8);
      return JSON.parse(decryptedUser);
    }
    return {};
  }

  public clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}


