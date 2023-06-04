import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {UserService} from "../../../services/user.service";
import {Utilisateur} from "../../../modules/Utilisateur";
import {ToastrService} from "ngx-toastr";
import {DrService} from "../../../services/dr.service";
import {EttService} from "../../../services/ett.service";
import {Ett} from "../../../modules/Ett";
import {Dregional} from "../../../modules/Dregional";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentDate: Date = new Date();
  caisse: any;
  user!: Utilisateur;
  ett!:Ett;
  dr: Dregional | undefined ;
  // Create a BehaviorSubject to track the completion of getCurrentuser
  private currentUserSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private authService: AuthService,
              private tokenService: TokenStorageService, private userService: UserService,
              private drService: DrService,
              private ettService: EttService,
              private toastr: ToastrService) {
  }



  ngOnInit(): void {
    this.caisse = this.tokenService.getUser().caisse;
    this.getCurrentuser();
    this.getDr();
  }


  getCurrentuser() {
    const token = this.tokenService.getUser();

    if (token) {
      const username = token.username;

      this.userService.getUserBylogin(username).subscribe(value => {
        this.user = value;

        // Notify that getCurrentuser has completed
        this.currentUserSubject.next(true);
      });

    } else {
      this.toastr.error('The resource could not be found.', 'Error');
      // Token not found, handle accordingly
    }
  }

  getDr() {
    console.log("CALLED");
    this.currentUserSubject.subscribe(completed => {
      if (completed && this.user && this.user.ett && this.user.ett.idEtt) {
        this.ettService.getEtt(this.user.ett.idEtt).subscribe((value) => {
          this.ett = value;
          this.dr = value && value.dregional; // Add null check here
          console.log(this.dr);
          console.log(value);
        });
      }
    });
  }

}
