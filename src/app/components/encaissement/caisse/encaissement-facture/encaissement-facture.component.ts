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
import {InfoFacture} from "../../../../modules/InfoFacture";

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
  selectedFacture?: InfoFacture;
  private montantSubscription?: Subscription;
  private soldeSubscription?: Subscription;
  subscriptions: Subscription[] = [];
  updateRequest:Boolean=false;

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
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        header: 'Choisir Facture',
        width: '77%',
        baseZIndex: 10000,
        maximizable: true
      });
    this.ref.onClose.subscribe((facture: InfoFacture) => {
      if (facture) {
        this.selectedFacture = facture;
        this.factureForm.reset();
        this.patchFactureValues();
        this.updateRequest=true;
      }
    });
  }

  private patchFactureValues(): void {

    this.factureForm.patchValue({
      idFacture: this.selectedFacture?.idFacture,
      refFacture: this.selectedFacture?.refFacture,
      produit: this.selectedFacture?.produit,
      montant: this.selectedFacture?.montant,
      solde: this.selectedFacture?.solde,
      nappel: this.selectedFacture?.nappel,
      codeClient: this.selectedFacture?.codeClient,
      compteFacturation: this.selectedFacture?.compteFacturation,
      typeIdent: this.selectedFacture?.typeIdent,
      identifiant: this.selectedFacture?.identifiant,
      datLimPai: this.selectedFacture?.datLimPai
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
          tooltipLabel: 'PDF',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-file-pdf'

      },
      {
        tooltipOptions: {
          tooltipLabel: 'Print',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-print'

      }, {
        tooltipOptions: {
          tooltipLabel: 'Import',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-download',
        command: () => {
          this.importFacture();
        },

      }
    ];
  }

  private initForm(): void {
    this.factureForm = this.formBuilder.group({
      idFacture: [''],
      refFacture: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      produit: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      montant: [null, [Validators.required, Validators.min(1)]],
      solde: [null, [Validators.min(0), Validators.max(100)]],
      nappel: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      codeClient: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      compteFacturation: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      datLimPai: [null, Validators.required]
    });
    this.subToMontant();

  }

  subToMontant() {
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
    return isValid ? null : {whitespace: true};
  }


  private calculateTotal(): void {
    const montant = this.factureForm.get('montant')?.value;
    const solde = this.factureForm.get('solde')?.value;

    if (montant && solde) {
      this.total = montant - (montant * solde / 100);
    }
    else if (montant &&!solde) {
      this.total = montant;
    } else {
      this.total = 0; // Set a default value when either montant or solde is not available
    }
  }

  SaveFacture() {
    if (this.factureForm.valid) {
      const facture = this.factureForm.value;
      if (!this.updateRequest) {
        this.factureService.addFacture(facture).subscribe((value) => {
          this.toastr.success('Facture added successfully.', 'Success');
          this.factureForm.reset();
          this.factureForm.clearValidators();

        }, (error) => {
          this.toastr.error("Add facture failed !", "Error")
          console.error(error);
        }, () => {

        });
      }


    } else {
      this.toastr.warning('Fill facture correctly !', 'Warning');
    }


  }

}
