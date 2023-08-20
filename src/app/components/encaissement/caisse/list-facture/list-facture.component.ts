import {Component, OnDestroy, OnInit} from '@angular/core';
import {FactureService} from "../../../../services/facture.service";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Subscription} from "rxjs";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-list-facture',
  templateUrl: './list-facture.component.html',
  styleUrls: ['./list-facture.component.scss']
})
export class ListFactureComponent implements OnInit, OnDestroy {

  listFacture: InfoFacture[] = [];
  listSubscription!: Subscription;
  identifiant: string = "";
  ref: string = "";
  apl: number = 9;
  size: number = 9;
  page: number = 0;

  constructor(private factureService: FactureService, public refe: DynamicDialogRef) {
  }

  ngOnDestroy(): void {

    this.listSubscription.unsubscribe();
    if (this.refe) {
      this.refe.close();
    }
    console.log("destroy")
  }

  ngOnInit(): void {
    this.getfactures();

  }

   findfacture() {
    this.listSubscription = this.factureService.getAllFactures(this.identifiant, this.ref, this.apl).subscribe(
      (value) => {
        this.listFacture = value;
        console.log(value)
      }
    );

  }

  ImportFacture(facture: InfoFacture) {
    this.refe.close(facture);
  }


   getfactures() {
    this.listSubscription = this.factureService.getFactures().subscribe(
      (value) => {
        this.listFacture = value;
        console.log(value)
      }
    );
  }

  calculPercent(facture: InfoFacture): number {
    if (facture) {
      let somme: number = 0;
      facture.encaissements.forEach(value => {
        somme += value.montantEnc;
      });
      let percent: number = (somme / facture.montant) * 100;
      return parseFloat(percent.toFixed(0));
    }
    return 0;
  }
}
