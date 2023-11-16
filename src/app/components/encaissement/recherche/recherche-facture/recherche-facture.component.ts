import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Subscription} from "rxjs";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Paginator} from "primeng/paginator";

@Component({
  selector: 'app-recherche-facture',
  templateUrl: './recherche-facture.component.html',
  styleUrls: ['./recherche-facture.component.scss']
})
export class RechercheFactureComponent implements OnInit, OnDestroy {
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  listFacture: InfoFacture[] = [];
  display: InfoFacture[] = [];
  searchForm !: FormGroup;
  size = new FormControl(10);
  page = new FormControl(0);
  totalRecords: any;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private ettService: EttService) {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.subscribeSearchForm();
    this.sendSearch();
  }

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      refFacture: [''],
      produit: [''],
      montant: [null],
      solde: [null],
      identifiant: [''],
      compteFacturation: [''],
      status: ['']
    });
  }

  ClearSearchForm() {
    this.initSearchForm();

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
  handleFormChange() {
    const status = this.searchForm.get('status')?.value;

    if (status === 'RETARD') {
      const page = this.page.value ?? 0; // Get the current page value
      const size = this.size.value ?? 10; // Get the current size value

      // Calculate the start and end index based on page and size
      const startIndex = page * size;
      const endIndex = startIndex + size;

      // Slice the listFacture to create displayRetard
      this.display = this.listFacture.slice(startIndex, endIndex);
    } else {
      // If status is not 'RETARD', show the full list
      this.display = this.listFacture;
    }
  }
  paginate(event: Paginator): void {
    this.size.setValue(event.rows);
    this.page.setValue(Math.floor(event.first / event.rows));

      this.sendSearch();

  }

  subscribeSearchForm() {

  }

  sendSearch() {
    const { refFacture, produit,compteFacturation, montant, solde, identifiant, status } = this.searchForm.value;
    const page=this.page.value ?? 0;
    const size=this.size.value ?? 10;
    this.factureService.searchPageFactures(
      produit,
      refFacture,
      compteFacturation,
      identifiant,
      montant,
      solde,
      status,
      page,
      size
    ).subscribe((factures) => {
      this.listFacture = factures;
      const firstFacture = factures[0]; // Assuming there's at least one facture in the list
      this.totalRecords = firstFacture ? firstFacture.totalElements : 0;
      this.display= factures;
      this.handleFormChange();
    });
  }
}
