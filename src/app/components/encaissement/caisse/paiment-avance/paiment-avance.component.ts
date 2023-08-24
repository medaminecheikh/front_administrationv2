import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {InfoFacture} from "../../../../modules/InfoFacture";
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
  factureSelected?:InfoFacture;
  events!: EventItem[];
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

    if (facture!=this.factureSelected) {
      this.factureSelected = facture;
    } else {this.factureSelected=undefined;
    }
  }

  resetSelection() {
    if (this.factureSelected) {
      this.factureSelected = undefined;
    }
  }
}
