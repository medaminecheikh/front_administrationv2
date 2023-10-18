import {Component, OnDestroy, OnInit} from '@angular/core';
import {Utilisateur} from "../../../modules/Utilisateur";
import {Ett} from "../../../modules/Ett";
import {Subscription} from "rxjs";
import {InfoFacture} from "../../../modules/InfoFacture";
import {AuthService} from "../../../services/auth/auth.service";
import {UserService} from "../../../services/user.service";
import {EttService} from "../../../services/ett.service";
import {ToastrService} from "ngx-toastr";
import {FactureService} from "../../../services/facture.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listMonthlyFacture: InfoFacture[] = [];
  listyearlyFacture: InfoFacture[] = [];
  listFactureRetard: InfoFacture[] = [];
  listFactureFinished: InfoFacture[] = [];
  listFactureCorrect: InfoFacture[] = [];
  nbrEmploye: number = 0;
  nbrCaisse: number = 0;

  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService,
              private toastr: ToastrService, private factureService: FactureService) {
    this.getUser();
  }

  ngOnInit(): void {

    this.getMonthlyFacture();
    this.getYearlyFacture();

  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  getMonthlyFacture() {
    this.factureService.getMonthlyFactures().subscribe((factures) => {
      this.listMonthlyFacture = factures;
      console.log("factures", factures)
    }, () => {

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
      }, () => {
        this.calculNbrEmploye();
      });
  }

  calculNbrEmploye() {
    this.nbrEmploye = this.ett.utilisateurs.length;
    this.nbrCaisse = this.ett.caisses.length;
  }

   getYearlyFacture(){

    this.factureService.getYearlyFactures().subscribe((value) => {
        this.listyearlyFacture = value;

      }, error => {
      this.toastr.error('Yearly Factures resources not found !', 'Error')
      }, () => {
      console.log('listyearlyFacture', this.listyearlyFacture);

      }
    );


}







  montantafterdiscount(facture:InfoFacture):number {
     if (facture) {
       return (facture.montant) - ((facture.montant * facture.solde) / 100);
     } else {
       return 0;
     }
  }

}
