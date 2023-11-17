import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Paginator} from "primeng/paginator";
import {Encaissement} from "../../../../modules/Encaissement";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-recherche-encaissement',
  templateUrl: './recherche-encaissement.component.html',
  styleUrls: ['./recherche-encaissement.component.scss']
})
export class RechercheEncaissementComponent implements OnInit, OnDestroy {
  display: Encaissement[] = [];
  searchForm !: FormGroup;
  size = new FormControl(10);
  page = new FormControl(0);
  totalRecords: any;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private encaiService: EncaissementService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private ettService: EttService) {
  }


  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.sendSearch();
  }

  paginate(event: Paginator): void {
    this.size.setValue(event.rows);
    this.page.setValue(Math.floor(event.first / event.rows));
    this.sendSearch();
  }

  ClearSearchForm() {

  }

  sendSearch() {
    const {refFacture, produit, montantEnc, modePaiement, identifiant, typeIdent, requet} = this.searchForm.value;
    const page = this.page.value ?? 0;
    const size = this.size.value ?? 10;
    this.unsubscribeAll();
    if (requet === 'year') {
      this.subscriptions.push(
        this.encaiService.searchYearEncaissement(produit, identifiant, modePaiement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe()
      );

    } else if (requet === 'month') {
      this.subscriptions.push(
        this.encaiService.searchMonthEncaissement(produit, identifiant, modePaiement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe()
      );
    } else if (requet === 'week') {
      this.subscriptions.push(
        this.encaiService.searchWeekEncaissement(produit, identifiant, modePaiement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe()
      );
    }
  }


  private initSearchForm() {
    this.searchForm = this.formBuilder.group({
      refFacture: [''],
      produit: [''],
      montantEnc: [null],
      modePaiement: [''],
      identifiant: [''],
      typeIdent: [''],
      requet: ['month']
    });
  }

  private unsubscribeAll() {
    // Unsubscribe from all existing subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the array
  }
}
