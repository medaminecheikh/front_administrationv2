import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AppComponent} from "../../app.component";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  form = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService,private userService: UserService,private toastr: ToastrService,
              private router: Router) {


    authService.logout();
  }

  onSubmit(): void {
    const {username, password} = this.form;

    this.authService.login(username, password).subscribe(

      data => {

        this.roles = data.roles;

        this.isLoggedIn = true;
        this.isLoginFailed = false;

        if (this.roles.includes('ADMIN')) {
          this.router.navigate(['admin']).then(() => {
            // Reload the current URL
            window.location.reload();
          });
        } else if (this.roles.includes('FO')&& data.caisse ){
          this.router.navigate(['encaissement']).then(() => {
            // Reload the current URL
            window.location.reload();

          });
        }else if (this.roles.includes('BO')){
          this.router.navigate(['encaissement']).then(() => {
            // Reload the current URL
            window.location.reload();

          });
        }else {this.toastr.error('Pas de Caisse pour ce compte !', 'error');}

      },
      (error) => {
        if (error.status === 401) {
          this.toastr.error('Login ou mot de passe incorrect.', 'error');
          this.errorMessage = "Login ou mot de passe incorrect";
        } else if (error.status === 403) {
          this.toastr.error('Le compte est désactivé.', 'error');
          this.errorMessage = "Le compte est désactivé";
        } else if (error.status === 419) {
          this.toastr.error('Le compte a expiré.', 'error');
          this.errorMessage = "Le compte a expiré";
        } else {
          this.toastr.error('Une erreur est survenue.', 'error');
          this.errorMessage = "Une erreur est survenue ";
        }
        this.isLoginFailed = true;
      }
    );
  }

    ngOnInit(): void {
this.authService.logout();
  }
}
