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
import {ChartConfiguration, ChartOptions} from "chart.js";
import {formatDate} from "@angular/common";

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


  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [70, 30, 60, 50, 30, 90, 40],
        label: 'Revenue',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(87,171,220,0.78)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService,
              private toastr: ToastrService, private factureService: FactureService) {
    this.getUser();
    this.getYearlyFacture();
  }

  ngOnInit(): void {

    this.getMonthlyFacture();


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

  getYearlyFacture() {

    this.factureService.getYearlyFactures().subscribe((value) => {
        this.listyearlyFacture = value;

        this.listFactureRetard = value.filter(value1 => this.factureRetard(value1));
        this.listFactureCorrect = value.filter(value1 => !this.factureRetard(value1));

      }, error => {
        console.error(error);
        this.toastr.error('Yearly Factures resources not found !', 'Error')
      }, () => {
      }
    );

  }


  factureRetard(facture: InfoFacture): boolean {
    if ("COMPLET" === facture.periode.toUpperCase()) {
      const paied: number = facture.encaissements
        .map(encaissement => encaissement.montantEnc)
        .reduce((acc, montant) => acc + montant, 0);

      return (facture.montant - (facture.montant * facture.solde / 100)) > paied;
    } else {
      const datCreation: Date = facture.datCreation;
      const datLimPai: Date = facture.datLimPai;

      if (datCreation && datLimPai) {
        // Assuming that the dates are stored as strings in 'yyyy-MM-dd' format
        const formatter = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});

        const localDatCreation = new Date(formatDate(datCreation, 'yyyy-MM-dd', 'en-US'));
        const localDatLimPai = new Date(formatDate(datLimPai, 'yyyy-MM-dd', 'en-US'));

        const daysBetween = Math.floor((localDatLimPai.getTime() - localDatCreation.getTime()) / (1000 * 3600 * 24));
        const yearsBetween = localDatLimPai.getFullYear() - localDatCreation.getFullYear();
        console.log(`Days between datCreation and datLimPai: ${daysBetween}, ${yearsBetween}`);

        const numberOfPayments = this.calculateNumberOfPayments(yearsBetween, facture.periode);

        const totalAmount = (facture.montant - (facture.montant * facture.solde / 100));
        const tranche = totalAmount / numberOfPayments;

        // Assuming currentDate is the current date
        const currentDate = new Date();
        const daysFromCreation = Math.floor((currentDate.getTime() - localDatCreation.getTime()) / (1000 * 3600 * 24));

        // Calculate the current period
        let currentPeriod = Math.ceil(daysFromCreation / (daysBetween / numberOfPayments));
        const totalPaye = facture.encaissements
          .map(encaissement => encaissement.montantEnc)
          .reduce((acc, montant) => acc + montant, 0);

        console.log(`calculateNumberOfPayments: ${numberOfPayments}`);
        console.log(`Total Amount: ${totalAmount}`);
        console.log(`total Paye: ${totalPaye}`);
        console.log(`Tranche: ${tranche}`);
        console.log(`Current Period: ${currentPeriod}`);

        if (currentPeriod === 0) {
          currentPeriod += 1;
        }
        return totalPaye < tranche * currentPeriod;
      }

      return true;
    }
  }


  calculateNumberOfPayments(years: number, periode: string): number {
    if ("MENSUEL" === periode.toUpperCase()) {
      return Math.floor(years * 12); // Assuming monthly payments
    } else if ("SEMESTRIEL" === periode.toUpperCase()) {
      return Math.floor(years * 2); // Assuming semi-annual payments
    } else if ("TRIMESTRIEL" === periode.toUpperCase()) {
      return Math.floor(years * 3); // Assuming quarterly payments
    } else if ("ANNUEL" === periode.toUpperCase()) {
      return Math.floor(years); // Assuming annual payments
    }
    return 0; // Unknown periode, return 0 payments
  }


  montantafterdiscount(facture: InfoFacture): number {
    if (facture) {
      return (facture.montant) - ((facture.montant * facture.solde) / 100);
    } else {
      return 0;
    }
  }

}
