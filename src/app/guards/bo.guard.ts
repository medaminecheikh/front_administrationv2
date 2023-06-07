import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class BoGuard implements CanActivate {
  constructor(private authService: AuthService,private toastr: ToastrService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRoles = this.authService.getCurrentUser()?.roles;

    if (userRoles && userRoles.includes('BO')) {
      return true;
    } else {
      this.router.navigate(['encaissement']);
      this.toastr.error("Accès non autorisé", "Erreur");
      return false;
    }
  }

}
