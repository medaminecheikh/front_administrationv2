import {Component, OnDestroy, OnInit} from '@angular/core';
import {Encaissement} from "../../../../modules/Encaissement";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-print-facture',
  templateUrl: './print-facture.component.html',
  styleUrls: ['./print-facture.component.scss']
})
export class PrintFactureComponent implements OnInit, OnDestroy {
  encaissFactArray: any[] = [];
  selectedFacture?: any;
  total: number = 0.000;
  totalPaye: number = 0.000;
  montantRestant: number = 0.000;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.getData();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

    this.calculateTotal();
    this.calculateTotalMontant();
  }

  getData() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedFacture = navigation.extras.state['factureForm'];
      if (navigation.extras.state && navigation.extras.state['encaissFactArray']) {
        this.encaissFactArray = navigation.extras.state['encaissFactArray'];

        // Sort the array by the dateEnc property
        this.encaissFactArray.sort((a, b) => {
          const dateA = new Date(a.dateEnc).getTime();
          const dateB = new Date(b.dateEnc).getTime();

          return dateA - dateB;
        });
      }

    }

  }

  calculateTotal(): void {
    const montant = this.selectedFacture?.montant;
    const solde = this.selectedFacture?.solde;

    if (montant && solde) {
      this.total = montant - (montant * solde / 100);
    } else if (montant && !solde) {
      this.total = montant;
    } else {
      this.total = 0; // Set a default value when either montant or solde is not available
    }
  }
  calculateTotalMontant() {
    let totalMontant = 0;


    // Calculate sum for encaissFactArray
    for (const encaissement of this.encaissFactArray) {
      totalMontant += encaissement.montantEnc;
    }

    this.totalPaye = totalMontant;
  }

    printPage() {
      const printContents = document.querySelector('.print-content');
      if (printContents) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
      }
    }
}
