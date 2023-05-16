import { Injectable } from '@angular/core';
import {CurrentUser} from "../../modules/TokenResponse";
import {BehaviorSubject, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenStorageService} from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  host = "http://localhost:8088/POS/auth/";
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser: Observable<CurrentUser | null>;

  constructor(private http: HttpClient,private router: Router,private tokenStorage:TokenStorageService) {
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });
    return this.http
      .post<any>(
        this.host + 'authenticate?password=' + password + '&username=' + username,
        null,
        { headers }
      )
      .pipe(
        map((response) => {
          const user = {
            username: response.username || '',
            roles: response.roles || [],
            accessToken: response.accessToken || '',
            refreshToken: response.refreshToken || '',

          };
          this.tokenStorage.saveToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.tokenStorage.saveUser(user);
          return user;
        })
      );
  }

  logout() {
    this.setCurrentUser(null);
    this.tokenStorage.clear();
    this.router.navigate(['/login']);
  }


  refreshToken(){
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      return this.http.get<any>(this.host+'refreshtoken', { headers: { 'Authorization': 'Bearer ' + refreshToken } })
        .pipe(map(response => {
          const user = {
            username: response.username,
            roles: response.roles,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          };
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('refreshToken', response.refreshToken);
          this.setCurrentUser(user);
          return user;
        }));
    }
    return throwError('No refresh token available');
  }

  setCurrentUser(user: CurrentUser | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): CurrentUser | null {
    return this.tokenStorage.getUser();
  }
}
