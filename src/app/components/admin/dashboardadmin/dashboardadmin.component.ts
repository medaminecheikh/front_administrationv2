import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {Zone} from "../../../modules/Zone";
import {ZoneService} from "../../../services/zone.service";
import {DrService} from "../../../services/dr.service";
import {EttService} from "../../../services/ett.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../services/user.service";
import {Utilisateur} from "../../../modules/Utilisateur";
import {Ett} from "../../../modules/Ett";
import {catchError, lastValueFrom, Subscription} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {ProfilService} from "../../../services/profil.service";
import {Profil} from "../../../modules/Profil";


@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.scss']
})
export class DashboardadminComponent implements OnInit, OnDestroy {
  public chartBars: any;
  listZone: Zone[] = [];
  listUsers: Utilisateur[] = [];
  listUsersExpired: Utilisateur[] = [];
  listUsersAdmin: Utilisateur[] = [];
  listUsersBO: Utilisateur[] = [];
  listUsersFO: Utilisateur[] = [];
  currentUser!: Utilisateur;
  ett!: Ett;
  userSubscription!: Subscription;
  ettSubscription!: Subscription;
  subscriptions: Subscription[] = [];
  zone = new FormControl('');
   listUsersMiss: Utilisateur[]=[];
   listProfils: Profil[]=[];

  constructor(private zoneService: ZoneService,
              private dregionalService: DrService,
              private profilService: ProfilService,
              private authService: AuthService,
              private ettService: EttService,
              private router: Router, private formBuilder: FormBuilder,
              private toastr: ToastrService, private userService: UserService) {


    this.getZones();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.ettSubscription?.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getUser();
    this.getProfils();

  }

  getProfils() {
    const sub = this.profilService.getAllProfiles().subscribe({
      next: (profils) => {
        this.listProfils = profils;
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
    this.subscriptions.push(sub);
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
          if (this.currentUser.ett) {
            this.getEtt();
          }
        });
    } else
      this.toastr.error('User resources not found !', 'Error')
  }

  getEtt() {
    this.ettSubscription = this.ettService.getEtt(this.currentUser.ett.idEtt).subscribe(value => {
        this.ett = value;
      },
      error => {
        this.toastr.error('Ett resources not found !', 'Error');
        console.error(error);
      }, () => {

      });
  }

 async createChart() {
    let labels: string[] = [];
    let actif: number[] = [];
    let expire: number[] = [];
    for (const zone1 of this.listZone) {
      labels.push(zone1.cod_ZONE.charAt(0).toUpperCase() + zone1.cod_ZONE.slice(1));

      try {
        const value = await this.userService.getUserByZoneId(zone1.idZone).toPromise();

        let countexpire = value?.filter(values => values.estActif === 0 || values.is_EXPIRED === 1).length;
        if (countexpire) {
          expire.push(countexpire);
        }

        let countactif = value?.filter(values => values.estActif === 1 && values.is_EXPIRED === 0).length;
        if (countactif) {
          actif.push(countactif);
        }
      } catch (e) {
        console.error(e);
      }
    }
    this.configChart(labels,actif,expire);

  }

  getZones() {
   const sub= this.zoneService.getZones().subscribe((zones) => {
      this.listZone = zones;
    }, (error) => {
      this.toastr.error('Could not get zones list !', 'Error');
      console.error(error);
    }, () => {
      this.createChart();
    });
    this.subscriptions.push(sub);
  }

  private configChart(labels:any,actif:any,expire:any) {
    this.chartBars = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: labels,

        datasets: [
          {
            label: "Actif",
            data: actif, backgroundColor: "#4b94bfff",

          },
          {
            label: "Expiré",
            data: expire, backgroundColor: "#d2d6deff"

          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  private getAllUsers() {
    const sub = this.userService.getUserAll().subscribe((users) => {
      this.listUsers = users;
      this.listUsersMiss = users.filter(user => !user.profilUser || !user.ett);
      this.listUsersBO = users.filter(user => user.profilUser && user.profilUser.some(profil => profil.profil.nomP.includes('BO')));
      this.listUsersFO = users.filter(user => user.profilUser && user.profilUser.some(profil => profil.profil.nomP.includes('FO')));
      this.listUsersAdmin = users.filter(user => user.profilUser && user.profilUser.some(profil => profil.profil.nomP.includes('ADMIN')));
      this.listUsersExpired = users.filter(values => values.estActif === 0 || values.is_EXPIRED === 1);
    }, error => {
      console.error(error);
    });
    this.subscriptions.push(sub);
  }

}
