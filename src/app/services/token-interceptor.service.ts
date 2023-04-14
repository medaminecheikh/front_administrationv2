import { Injectable } from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {HttpClient, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenStorageService} from "./auth/token-storage.service";
import {ToastrService} from "ngx-toastr";
import {catchError, throwError} from "rxjs";
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private tokenStorage: TokenStorageService,
              private authService: AuthService, private toastr: ToastrService,private http: HttpClient) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.tokenStorage.getToken();
    console.log(token);
    if (token !== null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`)});
    }
    return next.handle(authReq).pipe(
      catchError(errordata => {
        if (errordata.status === 403 &&this.tokenStorage.isTokenExpired() || errordata.status === 401 &&this.tokenStorage.isTokenExpired()) {
          // need to implement logout
          this.authService.logout();
         this.toastr.error("Your session has expired","Session Expired")

        }
        return throwError(errordata);
      })
    );

  }
}
