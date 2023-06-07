import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Caisse} from "../../../../modules/Caisse";
import {Utilisateur} from "../../../../modules/Utilisateur";
import {ZoneService} from "../../../../services/zone.service";
import {DrService} from "../../../../services/dr.service";
import {EttService} from "../../../../services/ett.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../services/user.service";
import {CaisseService} from "../../../../services/caisse.service";
import {Zone} from "../../../../modules/Zone";
import {Dregional} from "../../../../modules/Dregional";
import {Ett} from "../../../../modules/Ett";
import {catchError, map, of, Subscription, switchMap, throwError} from "rxjs";

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit, OnDestroy {
  zone = new FormControl();
  directionreg: FormControl = new FormControl();
  ett: FormControl = new FormControl();
  listCaisse: Caisse[] = [];
  caisseForm!: FormGroup;
  caisse!: Caisse;
  usersfromett: Utilisateur[] = [];
  zones: Zone[] = [];
  dregionals: Dregional[] = [];
  etts: Ett[] = [];
  ettselected!: String | null;
  userselected!: String | null ;
  zoneSubscription!: Subscription;
  dregSubscription!: Subscription;
  ettSubscription!: Subscription;

  constructor(
    private zoneService: ZoneService,
    private dregionalService: DrService,
    private ettService: EttService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private caisseService: CaisseService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchZones();
    this.subscribeToZoneChanges();
    this.subscribeToDregChanges();
    this.subscribeToEttChanges();

  }

  ngOnDestroy(): void {
    this.zoneSubscription.unsubscribe();
    this.dregSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  searchCaisse(): void {
    this.caisseService.listCaisses().subscribe((value) => {
      this.listCaisse = value;
      console.log("this.listCaisse", value)
    });

  }

  fetchZones(): void {
    this.zoneService.getZones().subscribe(
      zones => {
        this.zones = zones;
        this.resetDregEttSelections();
      },
      error => console.error(error)
    );
  }

  subscribeToZoneChanges(): void {
    this.zoneSubscription = this.zone.valueChanges.subscribe(zoneId => {
      this.dregionals = [];
      if (zoneId) {
        this.fetchDregionals(zoneId);
      } else {
        this.resetDregEttSelections();
      }
    });
  }

  subscribeToDregChanges(): void {
    this.dregSubscription = this.directionreg.valueChanges.subscribe(dregId => {
      this.onSelectionDreg();
      if (dregId) {
        this.fetchEtts(dregId);
      } else {
        this.resetDregEttSelections();
      }
    });
  }

  subscribeToEttChanges(): void {
    this.ettSubscription = this.ett.valueChanges.subscribe((value) => {
      // Ignore the initial undefined value
      if (typeof value === 'undefined') {
        return;
      }
      this.ettselected = value;
      this.userselected = null;
      this.usersfromett = [];
      this.getUsersFromEtt();
      this.caisseForm.reset();
      this.caisseDispo();
    });
  }

  caisseDispo(): number[] {
    const selectedEtt = this.etts.find((ett) => ett.idEtt === this.ettselected);
    if (selectedEtt) {
      const assignedNumCaiseValues = selectedEtt.caisses.map((caisse) => caisse.numCaise);
      const allNumCaiseValues = Array.from({length: 10}, (_, i) => i + 1);
      return allNumCaiseValues.filter((numCaise) => !assignedNumCaiseValues.includes(numCaise));
    }
    return [];
  }

  getUsersFromEtt() {
    if (this.ettselected) {
      this.ettService.getEtt(this.ettselected).subscribe((value) => {
        this.usersfromett = value.utilisateurs.filter((user) => {
          return user.profilUser.some((profilUser) => profilUser.profil.nomP === 'FO');
        });
        this.userselected = null; // Reset the user selection
        console.log(this.usersfromett);
      });
    }
  }

  fetchDregionals(zoneId: string): void {
    this.dregionalService.getDregionalsByZone(zoneId).subscribe(
      (dregionals) => {
        this.dregionals = dregionals;
        this.directionreg.reset();
        this.ett.reset();
        this.userselected = null;
        this.etts = [];
      },
      (error) => console.error(error)
    );
  }

  fetchEtts(dregId: string): void {
    this.ettService.getEttsByDrId(dregId).subscribe(
      (etts) => {
        this.etts = etts;
        this.ett.reset();
        this.ettselected = null;
        this.userselected = null;
      },
      (error) => console.error(error)
    );
  }


  resetDregEttSelections(): void {
    this.userselected = null;
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }

  onSelectionzone(): void {
    this.directionreg.reset();
    this.ett.reset();
    this.userselected = null;
    this.etts = [];
  }

  onSelectionDreg(): void {
    this.ett.reset();
    this.userselected = null;
    this.etts = [];
  }

  initializeForm(): void {
    this.caisseForm = this.formBuilder.group({
      numCaise: ['', Validators.required],
      f_Actif: ['0', Validators.required]
    });
  }


  addCaisse() {
    if (this.caisseForm.valid) {
      const caisse = this.caisseForm.value;
      const user = this.userselected;
      const ettid = this.ettselected;

      this.caisseService.addCaisse(caisse).pipe(
        switchMap((response) => {
          const idCaisse = response.idCaisse;
          let observableChain = of(null);

          if (ettid) {
            observableChain = observableChain.pipe(
              switchMap(() => this.caisseService.affecterCaisseToEtt(idCaisse, ettid)),
              map(() => null) // Transform the emitted value to null
            );
          }
          console.log("user", user)
          if (user) {
            observableChain = observableChain.pipe(
              switchMap(() => this.caisseService.affecterCaisseToUser(idCaisse, user)),
              map(() => null) // Transform the emitted value to null
            );
          }

          return observableChain.pipe(
            catchError((error) => {
              // Rollback the changes if an error occurs
              return this.rollbackChanges(idCaisse, error);
            })
          );
        })
      ).subscribe(
        () => {
          // Success
          this.router.navigate(['encaissement/ett/caisse']).then(() => {
            // Reload the current page
            location.reload();});
          this.toastr.success('Caisse added successfully.');
        },
        (error) => {
          // Handle error
          this.toastr.error('Error occurred while adding caisse.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill the form correctly.', 'Warning');
    }
  }


  rollbackChanges(idCaisse: string, error: any) {
    // Delete the caisse if it was created
    if (idCaisse) {
      this.caisseService.deleteCaisse(idCaisse).subscribe();
    }

    // Handle specific error scenarios and display appropriate messages
    if (error.status === 409) {
      // Handle conflict error (e.g., profile already assigned to the user)
      this.toastr.error('Conflict error occurred.', 'Error');
    } else {
      // Handle generic errors
      this.toastr.error('Error occurred.', 'Error');
    }

    return throwError(error);
  }

}
