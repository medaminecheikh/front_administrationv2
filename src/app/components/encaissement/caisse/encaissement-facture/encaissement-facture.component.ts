import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ListFactureComponent} from "../list-facture/list-facture.component";
import {MenuItem} from "primeng/api";
import {debounceTime, Subscription} from "rxjs";

@Component({
  selector: 'app-encaissement-facture',
  templateUrl: './encaissement-facture.component.html',
  styleUrls: ['./encaissement-facture.component.scss']
})
export class EncaissementFactureComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | undefined;
  items!: MenuItem[];
  today: Date = new Date();
  factureForm !: FormGroup;
  total: any = 0.000;
  private montantSubscription?: Subscription;
  private soldeSubscription?: Subscription;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private encaissementService: EncaissementService,
              private dialogService: DialogService
  ) {
  }

  ngOnDestroy(): void {
    this.montantSubscription?.unsubscribe();
    this.soldeSubscription?.unsubscribe();
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.initItems();
  }

  importFacture() {
    this.ref = this.dialogService.open(ListFactureComponent,
      {
        header: 'Select a Product',
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true
      });
  }

  private initItems() {
    this.items = [
      {
        tooltipOptions: {
          tooltipLabel: 'Delete',
          tooltipPosition: 'bottom'
        },
        icon: 'pi pi-trash ',
        command: () => {

        }
      },

      {
        tooltipOptions: {
          tooltipLabel: 'Refresh',
          tooltipPosition: 'bottom'
        },
        icon: 'pi pi-refresh',
        command: () => {

        }
      },

      {
        tooltipOptions: {
          tooltipLabel: 'Import',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-upload',
        command: () => {
          this.importFacture();
        },

      },
      {
        tooltipOptions: {
          tooltipLabel: 'Print',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-print'

      }
    ];
  }

  private initForm(): void {
    this.factureForm = this.formBuilder.group({
      idFacture: ['', Validators.required],
      refFacture: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      produit: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      montant: [null, [Validators.required, Validators.min(1)]],
      solde: [null, [Validators.required,  Validators.min(0), Validators.max(100)]],
      nAppel: [null, [Validators.required,  Validators.min(8)]],
      codeClient: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      compteFacturation: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      datLimPai: [null, Validators.required]
    });

    // Subscribe to value changes for montant and solde controls
    this.montantSubscription = this.factureForm
      .get('montant')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(value => {
        this.calculateTotal();
      });

    this.soldeSubscription = this.factureForm
      .get('solde')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(value => {
        this.calculateTotal();
      });
  }

  noWhitespaceStartorEnd(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const trimmedValue = value.trim();
    const isValid = value === trimmedValue;
    return isValid ? null : { whitespace: true };
  }


  private calculateTotal(): void {
    const montant = this.factureForm.get('montant')?.value;
    const solde = this.factureForm.get('solde')?.value;

    if (montant && solde) {
      this.total = montant - (montant * solde / 100);
    } else {
      this.total = 0; // Set a default value when either montant or solde is not available
    }
  }

}
