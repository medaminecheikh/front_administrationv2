import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {UserService} from "../../../services/user.service";
import {Utilisateur} from "../../../modules/Utilisateur";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentDate: Date = new Date();
  caisse: any;
  user!: Utilisateur;

  constructor(private router: Router, private authService: AuthService,
              private tokenService: TokenStorageService, private userService: UserService,
              private toastr: ToastrService) {
  }



  ngOnInit(): void {
    this.caisse = this.tokenService.getUser().caisse;
    this.getCurrentuser();

  }


  private getCurrentuser() {
    const token = this.tokenService.getUser();

    if (token) {

      const username = token.username;


      console.log('Username:', username);

      this.userService.getUserBylogin(username).subscribe(value => this.user=value);
      // Use the username and roles as needed
    } else {
      this.toastr.error('The resource could not be found.', 'Error');
      // Token not found, handle accordingly
    }

  }
}
