import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Subscription} from "rxjs";
import {TracageService} from "../../../../services/tracage.service";
import {Tracage} from "../../../../modules/Tracage";

@Component({
  selector: 'app-e1-encaissement',
  templateUrl: './e1-encaissement.component.html',
  styleUrls: ['./e1-encaissement.component.scss']
})
export class E1EncaissementComponent implements OnInit,OnDestroy{
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listTrace: Tracage[] = [];
  update:number=0;
  delete:number=0;
  add:number=0;
  constructor(private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private tracageService: TracageService,
              private encaissementService: EncaissementService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private ettService: EttService) {
    this.getUser();
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.tracageService.getTracagebyencaissement().subscribe(value => {
      this.listTrace = value;
      this.update = value.filter(value1 => value1.typeOp.toUpperCase() === "UPDATE").length;
      this.delete = value.filter(value1 => value1.typeOp.toUpperCase() === "DELETE").length;
      this.add = value.filter(value1 => value1.typeOp.toUpperCase() === "ADD").length;
    }, error => {
      console.error(error);
    });

  }
  getUser() {
    const name = this.authService.getCurrentUser()
    if (name && name.username) {
      this.userSubscription = this.userService.getUserBylogin(name.username).subscribe(
        (value) => {
          this.currentUser = value
        }
        , (error) => {
          this.toastr.error('Could not get user detail !', 'Error');
          console.error(error);
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
