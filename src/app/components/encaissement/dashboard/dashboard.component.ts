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
import {Chart, ChartConfiguration, ChartOptions} from "chart.js";
import {formatDate} from "@angular/common";
import {TracageService} from "../../../services/tracage.service";
import {Tracage} from "../../../modules/Tracage";
import {Encaissement} from "../../../modules/Encaissement";
import {EncaissementService} from "../../../services/encaissement.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listMonthlyFacture: InfoFacture[] = [];
  listyearlyFacture: InfoFacture[] = [];
  listFactureRetard: InfoFacture[] = [];
  listFactureFinished: InfoFacture[] = [];
  listFactureCorrect: InfoFacture[] = [];
  listTraceencaiss: Tracage[] = [];
  listTracefacture: Tracage[] = [];
  listEncaissement: Encaissement[] = [];
  nbrEmploye: number = 0;
  nbrCaisse: number = 0;


  public lineChartData:any
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  constructor(private authService: AuthService, private userService: UserService
    , private ettService: EttService,
              private toastr: ToastrService,
              private factureService: FactureService,
              private encaissementService: EncaissementService, private tracageService: TracageService) {

    this.getUser();
    this.getYearlyFacture();
    this.getTraceencaiss();
    this.getTraceFacture();

  }

  ngOnInit(): void {
    this.getencaissement();
    this.getMonthlyFacture();
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  getMonthlyFacture() {
    this.factureService.getMonthlyFactures().subscribe((factures) => {
      this.listMonthlyFacture = factures;
      console.log("factures", factures);
    }, () => {

    });
  }

  getTraceencaiss() {
    this.tracageService.getTracagebyencaissement().subscribe({
      next: value => {
        this.listTraceencaiss = value;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  getTraceFacture() {
    this.tracageService.getTracagebyfacture().subscribe({
      next: value => this.listTracefacture = value,
      error: err => {
        console.error(err);
      }
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
        this.listFactureFinished = value.filter(value => this.amountPaied(value) == this.montantafterdiscount(value));
        this.listFactureRetard = value.filter(value1 => this.factureRetard(value1));
        this.listFactureCorrect = value.filter(value1 => !this.factureRetard(value1));

      }, error => {
        console.error(error);
        this.toastr.error('Yearly Factures resources not found !', 'Error');
      }, () => {
      }
    );

  }

  getSemestre(): string[] {
    const months1 = ['January', 'February', 'March', 'April', 'May', 'June'];

    const months2 = ['July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (currentMonth <= 6) {
      return months1;
    } else
      // Return the current half-year
      return months2;
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

  amountPaied(facture: InfoFacture): number {
    let somme = 0;
    facture.encaissements.forEach(value => {
      somme += value.montantEnc;
    });
    return somme;
  }

  montantafterdiscount(facture: InfoFacture): number {
    if (facture) {
      return (facture.montant) - ((facture.montant * facture.solde) / 100);
    } else {
      return 0;
    }
  }

  gettraceEncaissSemestre() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (currentMonth <= 6) {
      return this.listTraceencaiss.filter(value => {
        const parsedDate: Date = new Date(value.time);
        return parsedDate.getMonth() <= 6;
      });
    } else {
      return this.listTraceencaiss.filter(value => {
        const parsedDate: Date = new Date(value.time);
        return parsedDate.getMonth() > 6;
      });
    }
  }

  gettraceFactureSemestre() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (currentMonth <= 6) {
      return this.listTracefacture.filter(value => {
        const parsedDate: Date = new Date(value.time);
        return parsedDate.getMonth() <= 6;
      });
    } else {
      return this.listTracefacture.filter(value => {
        const parsedDate: Date = new Date(value.time);
        return parsedDate.getMonth() > 6;
      });
    }
  }

  getPaimentDel() {
    return this.gettraceEncaissSemestre().filter(value => value.typeOp.toUpperCase() === "DELETE");
  }

  getPaimentAdd() {
    return this.gettraceEncaissSemestre().filter(value => value.typeOp.toUpperCase() === "ADD");
  }

  getfactureCree() {
    return this.gettraceFactureSemestre().filter(value => value.typeOp.toUpperCase() === "ADD");
  }

  calculateProgressPercentage(other: number, total: number) {
    return Math.round((other / total) * 100);
  }

  getpaiementthisSemestre() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    if (currentMonth <= 6) {
      return this.listEncaissement.filter(value => value.dateEnc.getMonth() <= 6);
    } else {
      return this.listEncaissement.filter(value => value.dateEnc.getMonth() > 6);
    }
  }

  getencaissement() {
    this.encaissementService.getEncaissThisYear().subscribe({
      next: (value: Encaissement[]) => {
        this.listEncaissement = value;
        this.updateChartData(value);
      },
      error: err => console.error(err), complete: () => {

      },

    });
  }

  getSemEncaissement() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let data: number[] = new Array(12).fill(0); // Initialize array with 12 zeros for 12 months

    const paiement = this.listEncaissement;

    paiement.forEach(value => {
      const month = new Date(value.dateEnc).getMonth();
      data[month] += value.montantEnc;
    });

    if (currentMonth <= 5) {
      // Cut the array for months <= 6 (January to June)
      data = data.slice(0, 6);
    } else {
      // Cut the array for months > 6 (July to December)
      data = data.slice(6, 12);
    }

    return data;
  }

  totalRevenu() {
    let totat=0;
    this.getSemEncaissement().forEach(value => {
      totat += value;})
    return totat;
  }
  updateChartData(encaiss:Encaissement[]) {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let data: number[] = new Array(12).fill(0);

    encaiss.forEach(value => {
      const month = new Date(value.dateEnc).getMonth();
      data[month] += value.montantEnc;
    });

    const info= currentMonth <= 5 ? data.slice(0, 6) : data.slice(6, 12);
    this.lineChartData = new Chart("Chart", {
      type:'line',
      data:
    {
      labels: this.getSemestre(),
        datasets:
      [
        {
          data: info,
          label: 'Revenue',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(87, 220, 171, 0.78)'
        }
      ],
    }, options: {
        responsive:true
      },

    });
  }
}
