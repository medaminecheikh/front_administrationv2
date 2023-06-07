import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZoneService} from "../../../../../services/zone.service";
import {DrService} from "../../../../../services/dr.service";
import {EttService} from "../../../../../services/ett.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CaisseService} from "../../../../../services/caisse.service";
import {Zone} from "../../../../../modules/Zone";
import {Dregional} from "../../../../../modules/Dregional";
import {Ett} from "../../../../../modules/Ett";
import {Subscription} from "rxjs";
import {Caisse} from "../../../../../modules/Caisse";
import {Utilisateur} from "../../../../../modules/Utilisateur";

@Component({
  selector: 'app-affect-caisse',
  templateUrl: './affect-caisse.component.html',
  styleUrls: ['./affect-caisse.component.scss']
})
export class AffectCaisseComponent implements OnInit, OnDestroy {
  zone = new FormControl();
  directionreg: FormControl = new FormControl();
  ett: FormControl = new FormControl();
  zones: Zone[] = [];
  dregionals: Dregional[] = [];
  etts: Ett[] = [];
  caissefromett: Caisse[] = [];
  usersfromett: Utilisateur[] = [];
  ettselected!: String | null;
  selectedcaisse!: string | null;
  userselected!: String | null;
  zoneSubscription!: Subscription;
  dregSubscription!: Subscription;
  ettSubscription!: Subscription;

  constructor(private zoneService: ZoneService,
              private dregionalService: DrService,
              private ettService: EttService,
              private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService, private caisseService: CaisseService) {
  }

  ngOnInit(): void {
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

  fetchDregionals(zoneId: string): void {
    this.dregionalService.getDregionalsByZone(zoneId).subscribe(
      (dregionals) => {
        this.dregionals = dregionals;
        this.directionreg.reset();
        this.ett.reset();
        this.selectedcaisse = null;
        this.userselected = null;
        this.etts = [];
      },
      (error) => console.error(error)
    );
  }

  subscribeToEttChanges(): void {
    this.ettSubscription = this.ett.valueChanges.subscribe((value) => {
      // Ignore the initial undefined value
      if (typeof value === 'undefined') {
        return;
      }
      this.ettselected = value;
      this.selectedcaisse = null;
      this.userselected = null;
      this.caissefromett = [];
      this.usersfromett = [];
      this.getCaissesFromEtt();

    });
  }

  resetDregEttSelections(): void {
    this.selectedcaisse = null;
    this.userselected = null;
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
    this.usersfromett = [];

  }

  onSelectionDreg(): void {
    this.ett.reset();
    this.selectedcaisse = null;
    this.userselected = null;
    this.etts = [];
    this.usersfromett = [];

  }

  fetchEtts(dregId: string): void {
    this.ettService.getEttsByDrId(dregId).subscribe(
      (etts) => {
        this.etts = etts;
        this.ett.reset();
        this.ettselected = null;
        this.selectedcaisse = null;
        this.userselected = null;
      },
      (error) => console.error(error)
    );
  }

  getCaissesFromEtt() {
    console.log(this.ettselected)
    if (this.ettselected) {
      this.ettService.getEtt(this.ettselected).subscribe((value) => {
        this.caissefromett = value.caisses.filter((caisse) => caisse.login === null || caisse.login === undefined);
        this.usersfromett = value.utilisateurs.filter((user) => user.caisse === null || user.caisse === undefined);
        this.selectedcaisse = null; // Reset the caisse selection
        console.log(this.caissefromett);
        console.log(this.usersfromett);
      });
    }
  }

  affectCaisse() {
    if (this.selectedcaisse) {
      const idcaisse = this.selectedcaisse;
      if (this.userselected) {
        const iduser = this.userselected;
        this.caisseService.affecterCaisseToUser(idcaisse, iduser).subscribe(
          () => {
            this.router.navigate(['encaissement/ett/caisse']).then(() => {
              // Reload the current page
              location.reload();});

          },
          (error) => {
            this.toastr.error("Une erreur est survenue lors de l'affectation de la caisse.", "Erreur");
          },() => {
            this.toastr.success("La caisse a été affectée avec succès.", "Succès");
          }
        );
      } else {
        this.toastr.info("Veuillez choisir un utilisateur.", "Info");
      }
    } else {
      this.toastr.info("Veuillez choisir une caisse.", "Info");
    }
  }

}
