import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {TokenStorageService} from "../services/auth/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService:AuthService,private route:Router,private storage:TokenStorageService) {
  }
  canActivate()
  {
    if (this.storage.getUser()!=null || !this.storage.isTokenExpired())
    {

      return true;
    }
    else
    {
      this.route.navigate(['login'])
      return false;
    }
  }

}
