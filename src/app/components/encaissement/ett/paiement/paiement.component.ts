import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {TracageService} from "../../../../services/tracage.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {forkJoin, mergeMap, of, single, Subscription} from "rxjs";
import {Encaissement} from "../../../../modules/Encaissement";

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listEncaissement: Encaissement[] = [];
  caisse: number = 0;
  delete: number = 0;

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
        this.ett = value;

        this.getList(value);
      },
      error => {
        console.error(error);
        this.toastr.error('Ett resources not found !', 'Error')
      })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

  }

  getList(ett: Ett) {
    const observables = ett?.caisses.map(value =>
      this.encaissementService.getEncaissementByCaisse(value.idCaisse)
    );

    forkJoin(observables)
      .subscribe(
        (results: Encaissement[][]) => {
          // Flatten the array and filter Encaissement objects
          this.listEncaissement.push(
            ...(results.flat().filter(value2 => value2?.etatEncaissement === 'DELETE') as Encaissement[])
          );

          // Call getdelete after processing all caisses
          this.getdelete();
        },
        error => {
          console.error(error);
        }
      );
  }

  getdelete() {
    this.listEncaissement.forEach(value => this.delete += value.montantEnc);
  }




}

