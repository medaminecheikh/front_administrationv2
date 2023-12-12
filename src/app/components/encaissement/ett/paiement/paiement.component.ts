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
import {concatMap, from, Observable, Subscription} from "rxjs";
import {Encaissement} from "../../../../modules/Encaissement";
import {Tracage} from "../../../../modules/Tracage";

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
  selectedEncaiss?: Encaissement;
  listTrace: Tracage[] = [];

  constructor(private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private tracageService: TracageService,
              private encaissementService: EncaissementService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private ettService: EttService) {

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
        this.caisse = value.caisses.length;
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
    this.getUser();
    this.tracageService.getTracagebycaisse().subscribe(value => this.listTrace = value);
  }

  getList(ett: Ett) {
    if (ett && ett.caisses && ett.caisses.length !== 0) {
      // Create an observable for each caisse
      const observables = ett?.caisses.map(value =>
        this.encaissementService.getEncaissementByCaisse(value.idCaisse)
      );

      // Use concatMap to process observables sequentially
      from(observables).pipe(
        concatMap((observable: Observable<Encaissement[]>) => observable)
      ).subscribe(
        (result: Encaissement[]) => {
          // Filter and add Encaissement objects
          const filteredResults = result.filter(value => value?.etatEncaissement === 'DELETE') as Encaissement[];
          this.listEncaissement.push(...filteredResults);
        },
        error => {
          console.error(error);
        },
        () => {
          // Call getdelete after processing all caisses
          this.getdelete();
        }
      );
    }
  }

  getdelete() {
    this.listEncaissement.forEach(value => this.delete += value.montantEnc);
  }


  deleteEncaise(enc: Encaissement) {
    const trace: Tracage = {
      utilisateur: this.currentUser,
      object: "Encaissement",
      typeOp: "DELETE",
      idTrace: 0,
      browser: '',
      time: '',
      ip: ''
    };
    this.encaissementService.deleteEncaiss(enc.idEncaissement).pipe().subscribe(
      () => {
        this.saveTrace(trace);
        this.refresh();
      }, error1 => {
        console.error(error1);
      }
    );
  }

  refresh() {
    this.router.navigate(['encaissement/ett/paiement']).then(() => {
      // Reload the current page
      location.reload();
    });
  }

  saveTrace(trace: Tracage) {
    this.tracageService.addTracage(trace).subscribe(value => {
    }, error => {
      console.error(error);
    });
  }

  annulerEncaise(encaiss: Encaissement) {
    const trace: Tracage = {
      utilisateur: this.currentUser,
      object: "Encaissement",
      typeOp: "UPDATE",
      idTrace: 0,
      browser: '',
      time: '',
      ip: ''
    };
    encaiss.etatEncaissement = "VALID";
    this.encaissementService.updateEncaiss(encaiss).subscribe({
      next: value => {
        this.saveTrace(trace);
        this.refresh();
      },
      error: err => {
        console.error(err)
      }
    });
  }
}

