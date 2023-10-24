import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../../services/auth/auth.service";
import {EttService} from "../../../../services/ett.service";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {Subscription} from "rxjs";
import {v4 as uuidv4} from "uuid";
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
  searchForm !: FormGroup;
  size = new FormControl(8);
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
  }

   initSearchForm() {
     this.searchForm = this.formBuilder.group({
       refFacture: [''],
       produit: [''],
       montant: [null],
       solde: [null],
       nappel: [null],
       codeClient: [''],
       compteFacturation: [''],
       typeIdent: ['Carte d\'identité'],
       identifiant: [''],
       periode: [null],
       datLimPai: [null]
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
  paginate(event
             :
             Paginator
  ):
    void {
    this.size.setValue(event.rows);
    this.page.setValue(Math.floor(event.first / event.rows));

  }
}
