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
  }

  ngOnInit(): void {
    this.findfacture();

  }

  private findfacture() {
    this.listSubscription = this.factureService.findAllFactures(this.identifiant, this.ref, this.apl, this.page, this.size).subscribe(
      (value) => {
        this.listFacture = value;
      }
    );

  }

  ImportFacture(facture: InfoFacture) {
    this.refe.close(facture);
  }


}
