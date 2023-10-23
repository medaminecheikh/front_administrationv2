import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {FactureService} from "../../../../services/facture.service";
import {EncaissementService} from "../../../../services/encaissement.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ListFactureComponent} from "../list-facture/list-facture.component";
import {ConfirmationService, MenuItem} from "primeng/api";
import {
  catchError,
  concatMap,
  debounceTime,
  EMPTY,
  finalize,
  forkJoin,
  retry,
  Subscription,
  switchMap,
  throwError
} from "rxjs";
import {InfoFacture} from "../../../../modules/InfoFacture";
import {Encaissement} from "../../../../modules/Encaissement";
import {v4 as uuidv4} from 'uuid';
import {Utilisateur} from "../../../../modules/Utilisateur";
import {Ett} from "../../../../modules/Ett";
import {EttService} from "../../../../services/ett.service";
import {AuthService} from "../../../../services/auth/auth.service";

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
  encaissementForm?: FormGroup;
  encaissementsArray: Encaissement[] = [];
  encaissFactArray: Encaissement[] = [];
  total: number = 0.000;
  selectedFacture?: InfoFacture;
  private montantSubscription?: Subscription;
  private soldeSubscription?: Subscription;
  subscriptions: Subscription[] = [];
  updateRequest: boolean = false;
  dureePaiment = new FormControl('1');
  visible: boolean = false;
  totalPaye: number = 0.000;
  montantRestant: number = 0.000;
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;

  showDialog() {
    this.initEncaissForm();
    this.visible = true;
  }

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService: UserService,
              private factureService: FactureService,
              private encaissementService: EncaissementService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private ettService: EttService
  ) {

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.montantSubscription?.unsubscribe();
    this.soldeSubscription?.unsubscribe();
    this.userSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.initForm();
    this.initItems();
    this.initEncaissForm();
    this.subsdureePaiment();

  }

  getUser() {
    const name = this.authService.getCurrentUser()
    if (name && name.username) {
      this.userSubscription = this.userService.getUserBylogin(name.username).subscribe(
        (value) => {
          this.currentUser = value
        }
        , (error) => {
          this.toastr.error('Could not get user detail !', 'Error')
        },
        () => {
          this.getEtt();
        });
    } else
      this.toastr.error('User resources not found !', 'Error')
  }

  getEtt() {
    this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
        this.ett = value
      },
      error => {
        this.toastr.error('Ett resources not found !', 'Error')
      })
  }

  calculMontantRestant(facture: InfoFacture) {
    if (facture) {
      let montantOriginal = (facture.montant - (facture.montant * facture.solde / 100));
      let montantPaye = 0.000;
      facture.encaissements.forEach(value => {
        montantPaye += value.montantEnc;
      })
      this.encaissementsArray.forEach(value => {
        montantPaye += value.montantEnc;
      });
      this.montantRestant = montantOriginal - montantPaye;
    } else {
      this.montantRestant = 0.000;
    }
  }

  importFacture() {
    this.ref = this.dialogService.open(ListFactureComponent,
      {
        header: 'Choisir Facture',
        width: '90%',
        baseZIndex: 10000,
        maximizable: true
      });
    this.ref.onClose.subscribe((facture: InfoFacture) => {
      if (facture) {
        this.encaissFactArray = [];
        this.selectedFacture = facture;
        this.factureForm.reset();
        this.patchFactureValues();
        this.updateRequest = true;
        facture.encaissements.forEach(value => {
          this.encaissFactArray.push(value);
        });
        this.encaissementsArray = [];
        console.log(facture)
      }
      this.disableFormControls();
      this.calculateTotalMontant();
    });
  }

  patchFactureValues(): void {

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
      periode: this.selectedFacture?.periode,
      datLimPai: this.selectedFacture?.datLimPai
    });


  }

  private initItems() {
    this.items = [
      {
        tooltipOptions: {
          tooltipLabel: 'Import',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-download',
        command: () => {
          this.importFacture();
        },

      },

      {
        tooltipOptions: {
          tooltipLabel: 'Print',
          tooltipPosition: 'left'
        },
        icon: 'pi pi-print',
        command: () => {
          this.openInPrint();
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Refresh',
          tooltipPosition: 'bottom'
        },
        icon: 'pi pi-refresh',
        command: () => {
          this.reloadpage();
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Delete',
          tooltipPosition: 'bottom'
        },
        icon: 'pi pi-trash ',
        command: () => {
          if (this.selectedFacture?.idFacture) {
            this.confirmDelete(this.selectedFacture?.idFacture);
          } else {
            this.toastr.info('Import Facture !.', 'Info');

          }

        }
      }


    ];
  }

  initEncaissForm() {
    if (this.selectedFacture) {
      this.calculMontantRestant(this.selectedFacture)
    }
    this.encaissementForm = this.initEncaissementForm();
    this.visible = false;
  }

  disableFormControls() {
    for (const controlName in this.factureForm.controls) {
      if (this.factureForm.controls.hasOwnProperty(controlName)) {
        this.factureForm.get(controlName)?.disable();
      }
    }
    this.dureePaiment.disable();
  }

  enableFormControls() {
    for (const controlName in this.factureForm.controls) {
      if (this.factureForm.controls.hasOwnProperty(controlName)) {
        this.factureForm.get(controlName)?.enable();
      }
    }
  }

  private initForm(): void {
    const today = this.today;
    this.factureForm = this.formBuilder.group({
      idFacture: [uuidv4().toString()],
      refFacture: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      produit: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      montant: [null, [Validators.required, Validators.min(1)]],
      solde: [null, [Validators.min(0), Validators.max(100)]],
      nappel: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      codeClient: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      compteFacturation: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', [Validators.required, this.noWhitespaceStartorEnd]],
      periode: ['COMPLET', Validators.required],
      datLimPai: [today, Validators.required]
    });
    this.subToMontant();
    this.resetArrayEncaiss();
    this.calculateTotalMontant();
  }

  noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    const hasWhitespace = value.includes(' ');
    return hasWhitespace ? {whitespace: true} : null;
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
    this.calculateTotalMontant();

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
    } else if (montant && !solde) {
      this.total = montant;
    } else {
      this.total = 0; // Set a default value when either montant or solde is not available
    }
  }

// Create the encaissementForm group with its form controls and validators
  private initEncaissementForm(): FormGroup {
    return this.formBuilder.group({
      idEncaissement: [uuidv4().toString()],
      dateEnc: [new Date(), Validators.required],
      montantEnc: [null, [Validators.required, Validators.max(this.total - this.totalPaye)]],
      etatEncaissement: [''],
      numRecu: [uuidv4().slice(3, 18)],
      refFacture: [this.factureForm?.get('refFacture')?.value || '', Validators.required],
      nappel: [this.factureForm?.get('nappel')?.value || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      codeClient: [this.factureForm?.get('codeClient')?.value || '', Validators.required],
      compteFacturation: [this.factureForm?.get('compteFacturation')?.value || '', Validators.required],
      typeIdent: ['Carte d\'identité', Validators.required],
      identifiant: ['', [Validators.required, this.noWhitespaceValidator]],
      periode: [''],
      produit: [this.factureForm?.get('produit')?.value || '', Validators.required],
      modePaiement: ['ESPECES', Validators.required],
      numCheq: [''],
      rib: [''],
      banque: [''],
      agenceBQ: [''],
      nTransTPE: [''],
      refBordereau: ['']
    });
  }

  // Add a new encaissementForm to the encaissementsArray if the form is valid
  addEncaissementToTable() {
    if (this.encaissementForm) { // Perform a null check
      if (this.encaissementForm.valid) {
        this.encaissementsArray.push(this.encaissementForm.value);
        this.initEncaissForm(); // Reset the form after adding
        this.visible = false;
        this.calculateTotalMontant();
      } else this.toastr.warning('Please fill the Payment correctly.', 'Warning');

    } else {
      this.toastr.warning('Please fill the Payment form correctly.', 'Warning');
    }
  }

  selectEspece(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('ESPECES');
  }

  selectCreditCard(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('CARTE BANCAIRE');
  }

  selectCheque(): void {
    this.encaissementForm?.get('modePaiement')?.setValue('CHEQUE');
  }

  isModeESPECES(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'ESPECES';
  }

  isModeCheque(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'CHEQUE';
  }

  isModeCarteBancaire(): boolean {
    return this.encaissementForm?.get('modePaiement')?.value === 'CARTE BANCAIRE';
  }

  removeEncaisseRow(i: number) {
    if (i >= 0 && i < this.encaissementsArray.length) {
      this.encaissementsArray.splice(i, 1);
      this.toastr.info('Payment removed successfully!', 'Info');
      this.calculateTotalMontant();
    }
  }

  resetArrayEncaiss() {
    const valueChangesSubscription = this.factureForm.valueChanges
      .pipe(debounceTime(1000)) // Wait for 3 seconds after each change
      .subscribe((value) => {
        // Code to execute after 3 seconds of no value changes

        this.visible = false;
        this.encaissementsArray = [];
        this.calculateTotalMontant();

        // Put your code here...
      });
    this.subscriptions.push(valueChangesSubscription);
  }

  deleteEncaiss(idEncaissement: string, i: number) {
    if (this.selectedFacture) {
      const idFac = this.selectedFacture.idFacture;
      this.factureService.removeEncaissementFromFacture(idEncaissement, idFac).subscribe(
        () => {

          this.removeEncaissFromArrayAndShowToast(i);
        }, () => {
          this.toastr.error('Payment delete failed!', 'Error');

        },
        () => {
          this.calculateTotalMontant();

        }
      );
    }

  }

  removeEncaissFromArrayAndShowToast(i: number) {
    if (i >= 0 && i < this.encaissFactArray.length) {

      this.encaissFactArray.splice(i, 1);

      this.toastr.info('Payment deleted successfully!', 'Info');
    }
  }

  reloadpage() {
    this.router.navigate(['encaissement/caisse/facture']).then(() => {
      // Reload the current page
      location.reload();
    });
  }

  confirmDelete(facId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Facture',
      icon: 'pi pi-exclamation-triangle  text-danger',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-link',
      rejectButtonStyleClass: 'p-button-link text-danger',
      accept: () => {
        // Handle the accept action
        this.deleteFacture(facId);

      },
      reject: () => {
        // Handle the reject action
      }
    });
  }

  confirmDeleteEncaiss(idEncaissement: string, j: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Delete Paiement',
      icon: 'pi pi-exclamation-triangle  text-danger',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-link',
      rejectButtonStyleClass: 'p-button-link text-danger',
      accept: () => {
        // Handle the accept action
        this.deleteEncaiss(idEncaissement, j);

      },
      reject: () => {
        // Handle the reject action
      }
    });
  }

  deleteFacture(facId: string): void {
    this.factureService.deleteFacture(facId).subscribe(() => {
      // Call the searchCaisse() method to refresh the list of caisses
      this.reloadpage();

    }, (error) => {
      this.toastr.error('Facture delete failed.', 'Error');

    }, () => {

      this.toastr.success('Facture deleted successfully.', 'Success');
    });
  }

  calculateTotalMontant() {
    let totalMontant = 0;

    // Calculate sum for encaissementsArray
    for (const encaissement of this.encaissementsArray) {
      totalMontant += encaissement.montantEnc;
    }

    // Calculate sum for encaissFactArray
    for (const encaissement of this.encaissFactArray) {
      totalMontant += encaissement.montantEnc;
    }

    this.totalPaye = totalMontant;
  }

  SaveFacture() {
    if (!this.updateRequest) {
      if (this.factureForm.valid) {
        const facture = this.factureForm.value;
        const idCaisse = this.currentUser?.caisse?.idCaisse;
        this.factureService.addFacture(facture).subscribe(
          (value) => {
            const idFact = value.idFacture;
            this.handleEncaissements(facture.idFacture,idCaisse);
          },
          (error) => {
            this.handleError('Add facture failed!', error);
          }
        );
      } else {
        this.toastr.warning('Fill facture correctly!', 'Warning');
      }
    } else {
      if (this.updateRequest && (this.factureForm.valid || this.factureForm.disabled)) {
        const facture = this.factureForm.value;
        const idCaisse = this.currentUser?.caisse?.idCaisse;
        this.factureService.updateFacture(facture).subscribe(
          () => {
            if (this.encaissementsArray.length > 0 && facture.idFacture) {
              this.handleEncaissements(facture.idFacture,idCaisse);
            }
          },
          (error) => {
            this.handleError('Facture update failed!', error);
          }
        );
      }
    }
  }

  handleEncaissements(factureId: string, idCaisse: string) {
    console.info("this.encaissementsArray", this.encaissementsArray);

    const observables = this.encaissementsArray.map((value) =>
      this.encaissementService.addEncaiss(value).pipe(
        switchMap((encaissement) =>
          this.factureService.affectEncaissementToFacture(factureId, encaissement.idEncaissement).pipe(
            switchMap(() =>
              this.encaissementService.affectEncaisseToCaisse(encaissement.idEncaissement, idCaisse).pipe(
                catchError((error) => {
                  this.toastr.error('Operation failed.', 'Error');
                  console.error(error);
                  return throwError(error);
                }),
                retry(2) // Retry the observable up to 2 more times in case of error
              )
            )
          )
        ),
        catchError((error) => {
          this.toastr.error('Payment creation failed.', 'Error');
          console.error(error);
          return throwError(error);
        }),
        retry(1) // Retry the observable up to 1 more time in case of error
      )
    );

    forkJoin(observables).subscribe(
      (responses) => {
        console.warn(responses);
        this.handleSuccess('Facture added successfully.');
        this.encaissFactArray.push(...this.encaissementsArray);
        this.resetForm();
      },
      (error) => {
        this.handleError('Payment creation failed!', error);
      }
    );
  }



  handleError(message: string, error: any) {
    this.toastr.error(message, 'Error');
    console.error(error);
  }

  handleSuccess(message: string) {
    this.toastr.success(message, 'Success');
  }

  resetForm() {
    this.encaissementsArray = [];
    this.encaissementForm?.reset();
    if (this.selectedFacture) {
      this.calculMontantRestant(this.selectedFacture);
    }
  }


  openInPrint() {
    const dataToPass = {
      factureForm: this.factureForm.value, // Pass the form data here
      encaissFactArray: this.encaissFactArray, // Pass the array data here
    };

    this.router.navigateByUrl('encaissement/caisse/print-facture', {state: dataToPass});
  }


  subsdureePaiment() {
    const sub1 = this.factureForm.get('periode')?.valueChanges.subscribe((period) => {
      if (!this.updateRequest) {
        const currentDate = new Date();
        let monthsToAdd = 0;
        const selectedPeriod = this.dureePaiment.value; // Get the selected dureePaiment value here

        if (period !== 'COMPLET') {
          if (selectedPeriod === '1') {
            monthsToAdd = 12;
          } else if (selectedPeriod === '2') {
            monthsToAdd = 24;
          } else if (selectedPeriod === '3') {
            monthsToAdd = 36;
          }

          // Update the 'datLimPai' FormControl with the new date
          currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
          this.factureForm.get('datLimPai')?.setValue(currentDate);
        } else {
          this.factureForm.get('datLimPai')?.setValue(this.today);
        }
      }
    });

    if (sub1) {
      this.subscriptions.push(sub1);
    }
  }

}
