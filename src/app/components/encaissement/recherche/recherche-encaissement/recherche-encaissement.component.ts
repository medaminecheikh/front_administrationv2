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
  selectedEncaissement?:Encaissement | null;
  searchForm !: FormGroup;
  size = new FormControl(10);
  page = new FormControl(0);
  totalRecords: any;
  private subscriptions: Subscription[] = [];
  visible: boolean=false;
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
  showDialog(encaissement:Encaissement ) {
    this.visible = true;
    this.selectedEncaissement = encaissement;
  }
  closeDialog() {
    this.visible = false;
    this.selectedEncaissement = null;
  }
  paginate(event: Paginator): void {
    this.size.setValue(event.rows);
    this.page.setValue(Math.floor(event.first / event.rows));
    this.sendSearch();
  }

  ClearSearchForm() {
    this.initSearchForm();
  }

  sendSearch() {
    const {refFacture, produit, montantEnc, etatEncaissement, identifiant, typeIdent, requet} = this.searchForm.value;
    const page = this.page.value ?? 0;
    const size = this.size.value ?? 10;
    this.unsubscribeAll();
    if (requet === 'year') {
      this.subscriptions.push(
        this.encaiService.searchYearEncaissement(produit, identifiant, etatEncaissement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe(value => {
            this.display = value;
            const firstEncaiss = value[0]; // Assuming there's at least one facture in the list
            this.totalRecords = firstEncaiss ? firstEncaiss.totalElements : 0;
          })
      );

    } else if (requet === 'month') {
      this.subscriptions.push(
        this.encaiService.searchMonthEncaissement(produit, identifiant, etatEncaissement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe(value => {
            this.display = value;
            const firstEncaiss = value[0]; // Assuming there's at least one facture in the list
            this.totalRecords = firstEncaiss ? firstEncaiss.totalElements : 0;
          })
      );
    } else if (requet === 'week') {
      this.subscriptions.push(
        this.encaiService.searchWeekEncaissement(produit, identifiant, etatEncaissement, typeIdent, montantEnc, refFacture, page, size)
          .subscribe(value => {
            this.display = value;
            const firstEncaiss = value[0]; // Assuming there's at least one facture in the list
            this.totalRecords = firstEncaiss ? firstEncaiss.totalElements : 0;
          })
      );
    }
  }


  private initSearchForm() {
    this.searchForm = this.formBuilder.group({
      refFacture: [''],
      produit: [''],
      montantEnc: [null],
      etatEncaissement: [''],
      identifiant: [''],
      typeIdent: [''],
      requet: ['year']
    });
  }

  private unsubscribeAll() {
    // Unsubscribe from all existing subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the array
  }
}
