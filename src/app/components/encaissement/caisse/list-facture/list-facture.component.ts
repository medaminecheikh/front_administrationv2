import {Component, OnDestroy, OnInit} from '@angular/core';
import {FactureService} from "../../../../services/facture.service";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Subscription} from "rxjs";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Paginator} from "primeng/paginator";

@Component({
    selector: 'app-list-facture',
    templateUrl: './list-facture.component.html',
    styleUrls: ['./list-facture.component.scss']
})
export class ListFactureComponent implements OnInit, OnDestroy {

    listFacture: InfoFacture[] = [];
    listSubscription!: Subscription;
    searchForm!: FormGroup;
    size: number = 8;
    page: number = 0;
    totalRecords: number =0;

    constructor(private factureService: FactureService, public refe: DynamicDialogRef, private formBuilder: FormBuilder) {
    }

    ngOnDestroy(): void {

        this.listSubscription.unsubscribe();
        if (this.refe) {
            this.refe.close();
        }
        console.log("destroy")
    }

    ngOnInit(): void {
        this.initSearchForm();
        this.sendSearch();

    }


    ImportFacture(facture: InfoFacture) {
        this.refe.close(facture);
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

    sendSearch() {
        const { produit, refFacture, compteFacturation, identifiant,montant  } = this.searchForm?.value;

        this.factureService
            .searchPageFactures(produit, refFacture, compteFacturation, identifiant,montant, this.page ||0, this.size)
            .subscribe((factures) => {
                this.listFacture = factures;
                const firstFacture = factures[0]; // Assuming there's at least one facture in the list
                this.totalRecords = firstFacture ? firstFacture.totalElements : 0;
            });
    }



  paginate(event: Paginator): void {
    this.size = event.rows;
    // Calculate the new page to maintain the current visible records
    this.page = Math.floor(event.first / this.size);
    this.sendSearch();
  }
}
