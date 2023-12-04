import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Encaissement} from "../../../../modules/Encaissement";
import {v4 as uuidv4} from "uuid";
import {Paginator} from "primeng/paginator";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {catchError, forkJoin, map, retry, Subscription, switchMap, throwError} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {CaisseService} from "../../../../services/caisse.service";
import {TracageService} from "../../../../services/tracage.service";
import {Tracage} from "../../../../modules/Tracage";

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-paiment-avance',
  templateUrl: './paiment-avance.component.html',
  styleUrls: ['./paiment-avance.component.scss']
})
export class PaimentAvanceComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listFacture: InfoFacture[] = [];
  factureSelected?: InfoFacture;
  events!: EventItem[];
  size = new FormControl(8);
  page = new FormControl(0);
  encaissementForm?: FormGroup;
  searchForm!: FormGroup;
  montantRestant: number = 0.000;
  totalRecords: any;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private encaissementService: EncaissementService,
              private tracageService: TracageService,
              private authService: AuthService,
              private ettService: EttService) {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.initEncaissForm();
    this.initSearchForm();
    this.sendSearch();

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


  calculMontantRestant(facture: InfoFacture) {
    if (facture) {
      let montantOriginal = (facture.montant - (facture.montant * facture.solde / 100));
      let montantPaye = 0.000;
      facture.encaissements.forEach(value => {
        if (value.etatEncaissement.toUpperCase()!=='DELETE') {
          montantPaye += value.montantEnc;
        }
      })
      this.montantRestant = montantOriginal - montantPaye;
    } else {
      this.montantRestant = 0.000;
    }
  }

  getProgressBarColor(value: number): string {
    if (value < 40) {
      return 'orange';
    } else if (value < 60) {
      return 'purple';
    } else if (value < 80) {
      return 'blue';
    } else {
      return 'green';
    }
  }

  calculPercent(facture: InfoFacture): number {
    if (facture) {
      let somme: number = 0;
      facture.encaissements.forEach(value => {
        somme += value.montantEnc;
      });

      let percent: number = (somme / (facture.montant - (facture.montant * facture.solde / 100))) * 100;
      return parseFloat(percent.toFixed(0));
    }
    return 0;
  }

  selectFacture(facture: InfoFacture) {

    if (facture != this.factureSelected) {
      this.factureSelected = facture;
      this.calculMontantRestant(facture);
      this.initEncaissForm()

    } else {
      this.initEncaissForm()

      this.factureSelected = undefined;
      this.montantRestant = 0.000;
    }
  }

  getSortedEncaissements(encaissements: Encaissement[]): Encaissement[] {
    // Sort encaissements by dateEnc in ascending order (oldest to newest)
    return encaissements.slice().sort((a, b) => new Date(b.dateEnc).getTime() - new Date(a.dateEnc).getTime());
  }

  resetSelection() {
    if (this.factureSelected) {
      this.factureSelected = undefined;
      this.initEncaissForm();
      this.montantRestant = 0.000;
    }
  }

  selectEspece(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('ESPECES');
  }

  selectCreditCard(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('CARTE BANCAIRE');
  }

  selectCheque(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('CHEQUE');
  }

  isModeESPECES(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'ESPECES';
  }

  isModeCheque(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'CHEQUE';
  }

  isModeCarteBancaire(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'CARTE BANCAIRE';
  }

  initEncaissForm() {
    this.encaissementForm = this.formBuilder.group({
      idEncaissement: [uuidv4().toString()],
      dateEnc: [new Date(), Validators.required],
      montantEnc: [null, [Validators.required, Validators.max(this.montantRestant || 0)]],
      etatEncaissement: ['VALID'],
      numRecu: [uuidv4().slice(3, 18)],
      refFacture: [this.factureSelected?.refFacture || '', Validators.required],
      nappel: [this.factureSelected?.nappel || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      codeClient: [this.factureSelected?.codeClient || '', Validators.required],
      compteFacturation: [this.factureSelected?.compteFacturation || '', Validators.required],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', [Validators.required, this.noWhitespaceValidator]],
      periode: [''],
      produit: [this.factureSelected?.produit || '', Validators.required],
      modePaiement: ['ESPECES', Validators.required],
      numCheq: [''],
      rib: [''],
      banque: [''],
      agenceBQ: [''],
      nTransTPE: [''],
      refBordereau: ['']
    });
  }

  noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const hasWhitespace = value.includes(' ');
    return hasWhitespace ? {whitespace: true} : null;
  }


  validerPaiement() {
    if (!this.factureSelected) {
      this.toastr.info("Choisir une Facture !", "Info");
      return;
    }

    if (!this.encaissementForm || !this.encaissementForm.valid) {
      this.toastr.warning("Paiement incorrect !", "Warning");
      return;
    }
    const trace: Tracage = {
      utilisateur: this.currentUser,
      object: "ENCAISSEMENT",
      typeOp: "ADD",
      idTrace: 0,
      browser: '',
      time: '',
      ip: ''
    };
    const encaissement = this.encaissementForm.value;
    const facture = this.factureSelected;
    const idCaisse = this.currentUser?.caisse?.idCaisse;

    if (idCaisse == null) {
      this.toastr.error("Caisse not found !", "Error");
      return;
    }

    this.encaissementService
      .addEncaiss(encaissement)
      .pipe(
        switchMap((encaissementResponse) =>
          this.factureService.affectEncaissementToFacture(facture.idFacture, encaissementResponse.idEncaissement).pipe(
            catchError((error) => {
              console.error("Error affecting encaissement to facture:", error);
              return throwError(error);
            }),
            switchMap((factureResponse) =>
              this.encaissementService.affectEncaisseToCaisse(encaissementResponse.idEncaissement, idCaisse).pipe(
                catchError((error) => {
                  console.error("Error affecting encaissement to caisse:", error);
                  return throwError(error);
                }),
                map((caisseResponse) => [factureResponse, caisseResponse])
              )
            )
          )
        )
      )
      .subscribe(
        ([factureResponse, caisseResponse]) => {
          console.warn('caisseResponse', caisseResponse);
          console.warn('factureResponse', factureResponse);
          this.factureSelected?.encaissements.push(encaissement);
          if (this.factureSelected) {
            this.calculMontantRestant(this.factureSelected);
          }
          this.toastr.success("Payment successfully processed!", "Success");
        },
        error => {
          console.error("Payment processing error:", error);
          this.toastr.error("Process has failed !", "Error");
        },
        () => {
          this.saveTrace(trace);
          this.initEncaissForm();
        }
      );

  }

  saveTrace(trace:Tracage) {
    this.tracageService.addTracage(trace).subscribe(value => {
    }, error => {
      console.error(error);
    });
  }
  payAll() {
    if (this.montantRestant != 0.000) {
      this.encaissementForm?.get('montantEnc')?.setValue(this.montantRestant)
    }
  }

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      produit: [''],
      refFacture: [''],
      compteFacturation: [''],
      identifiant: [''],
      montant: ['']

    });
  }

  paginate(event
             :
             Paginator
  ):
    void {
    this.size.setValue(event.rows);
    this.page.setValue(Math.floor(event.first / event.rows));
    this.sendSearch();
  }

  sendSearch() {
    const {produit, refFacture, compteFacturation, identifiant, montant} = this.searchForm?.value;
    const page = this.page.value;
    this.factureService
      .searchPageFactures(produit, refFacture, compteFacturation, identifiant, montant,'','', page || 0, this.size.value || 8)
      .subscribe((factures) => {
        this.listFacture = factures;
        const firstFacture = factures[0]; // Assuming there's at least one facture in the list
        this.totalRecords = firstFacture ? firstFacture.totalElements : 0;
      });
  }
}
