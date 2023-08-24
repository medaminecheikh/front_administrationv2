import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Encaissement} from "../../../../modules/Encaissement";
import {v4 as uuidv4} from "uuid";

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
  listFacture: InfoFacture[] = [];
  factureSelected?: InfoFacture;
  events!: EventItem[];
  encaissementForm?: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private encaissementService: EncaissementService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.initEncaissForm();
    this.factureService.getFactures().subscribe(value => {
      this.listFacture = value
    });
  }

  getProgressBarColor(value: number): string {
    if (value < 50) {
      return 'orange';
    } else if (value < 80) {
      return 'purple';
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
    } else {
      this.factureSelected = undefined;
    }
  }

  getSortedEncaissements(encaissements: Encaissement[]): Encaissement[] {
    // Sort encaissements by dateEnc in ascending order (oldest to newest)
    return encaissements.slice().sort((a, b) => new Date(b.dateEnc).getTime() - new Date(a.dateEnc).getTime());
  }

  resetSelection() {
    if (this.factureSelected) {
      this.factureSelected = undefined;
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
      montantEnc: [null, [Validators.required, Validators.max(this.factureSelected?.montant || 0)]],
      etatEncaissement: [''],
      numRecu: [uuidv4().slice(3, 18)],
      refFacture: [this.factureSelected?.refFacture || '', Validators.required],
      nappel: [this.factureSelected?.nappel || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      codeClient: [this.factureSelected?.codeClient || '', Validators.required],
      compteFacturation: [this.factureSelected?.compteFacturation || '', Validators.required],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', Validators.required],
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


}
