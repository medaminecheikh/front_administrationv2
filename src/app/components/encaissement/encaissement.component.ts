import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {UserService} from "../../services/user.service";
import {Utilisateur} from "../../modules/Utilisateur";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Ett} from "../../modules/Ett";
import {EttService} from "../../services/ett.service";

@Component({
  selector: 'app-encaissement',
  templateUrl: './encaissement.component.html',
  styleUrls: ['./encaissement.component.scss']
})
export class EncaissementComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;

  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getUser();

  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  getUser() {
    const name = this.authService.getCurrentUser()
    if (name && name.username) {
      this.userSubscription = this.userService.getUserBylogin(name.username).subscribe(
        (value) => {
          this.currentUser = value
        }
        , (error) => {
          this.toastr.error('Could not get user detail !', 'Error')
        },
        () => {
          this.getEtt();
        });
    } else
      this.toastr.error('User resources not found !', 'Error')
  }

  getEtt() {
    this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
        this.ett = value
      },
      error => {
        this.toastr.error('Ett resources not found !', 'Error')
      })
  }
}
