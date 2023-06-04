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
import {Subscription} from "rxjs";

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
  ettselected!: Ett | null;
  userselected!: Utilisateur;
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
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchZones();
    this.subscribeToZoneChanges();
    this.subscribeToDregChanges();
    this.subscribeToEttChanges();
    this.searchCaisse();
  }

  ngOnDestroy(): void {
    this.zoneSubscription.unsubscribe();
    this.dregSubscription.unsubscribe();
    this.ettSubscription.unsubscribe();
  }

  searchCaisse(): void {
    this.caisseService.listCaisses().subscribe((value) => (this.listCaisse = value));
  }

  fetchZones(): void {
    this.zoneService.getZones().subscribe(
      zones => this.zones = zones,
      error => console.error(error)
    );
  }

  subscribeToZoneChanges(): void {
    this.zoneSubscription = this.zone.valueChanges.subscribe(zoneId => {
      this.onSelectionzone();
      if (zoneId) {
        const selectedZone = this.zones.find(zone => zone.idZone === zoneId);
        if (selectedZone) {
          this.fetchDregionals(selectedZone.idZone);
        }
      } else {
        this.resetDregEttSelections();
      }
    });
  }

  subscribeToDregChanges(): void {
    this.dregSubscription = this.directionreg.valueChanges.subscribe(dregId => {
      this.onSelectionzone();
      if (dregId) {
        const selectedDreg = this.dregionals.find(dreg => dreg.idDr === dregId);
        if (selectedDreg) {
          this.fetchEtts(selectedDreg.idDr);
        }
      } else {
        this.resetDregEttSelections();
      }
    });
  }

  subscribeToEttChanges(): void {
    this.ettSubscription = this.ett.valueChanges.subscribe((value) => {
      this.ettselected = value
      console.log("values",value)
      console.log("values",this.ettselected)
    });

    this.getusersfromett();
  }
  getusersfromett(){

    if (this.ettselected){
      console.log("STARTED §§§§")
      this.usersfromett=this.ettselected.utilisateurs;
      console.log(this.usersfromett)}

  }
  fetchDregionals(zoneId: string): void {
    this.dregionalService.getDregionalsByZone(zoneId).subscribe(
      (dregionals) => {
        this.dregionals = dregionals;
        this.directionreg.reset();
        this.ett.reset();
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
      },
      (error) => console.error(error)
    );
  }

  resetDregEttSelections(): void {

    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }


  onSelectionzone(): void {
    this.ett.reset();
    this.ettselected = null;
    this.etts = [];
  }

  initializeForm(): void {
    this.caisseForm = this.formBuilder.group({
      numCaise: ['', Validators.required],
      f_Actif: ['0', Validators.required]
    });
  }

  addCaisse() {
    // Add your code to handle adding a caisse here
  }
}
