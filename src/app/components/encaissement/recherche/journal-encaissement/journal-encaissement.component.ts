import {Component, OnDestroy, OnInit} from '@angular/core';
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";
import {UserService} from "../../../../services/user.service";
import {EttService} from "../../../../services/ett.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-journal-encaissement',
  templateUrl: './journal-encaissement.component.html',
  styleUrls: ['./journal-encaissement.component.scss']
})
export class JournalEncaissementComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  responsiveOptions!: any[] | undefined;
  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1
      }
    ];
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
