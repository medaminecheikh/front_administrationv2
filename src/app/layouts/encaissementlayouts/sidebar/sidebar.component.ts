import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";

import {Profil} from "../../../modules/Profil";
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {Utilisateur} from "../../../modules/Utilisateur";
import {Fonctionalite} from "../../../modules/Fonctionalite";
import {ProfilService} from "../../../services/profil.service";
import {Subject, takeUntil} from "rxjs";
import {ModelService} from "../../../services/model.service";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  fonctions: Fonctionalite[] = [];
  profils: Profil[] = [];
  currentUser!: any;
  user!: Utilisateur;
  private unsubscribe = new Subject<void>();
  username!: any;
  Encaissement_Facture:boolean=false;
  Encaissement:boolean=false;
  Paiement_Avance:boolean=false;
  Recherche:boolean=false;
  Recherche_Encaissement:boolean=false;
  Recherche_Facture:boolean=false;
  Etat_edition:boolean=false;
  E1:boolean=false;
  E2:boolean=false;
  E3:boolean=false;
  ETT:boolean=false;
  paiement:boolean=false;
  Bordereau:boolean=false;
  Generation:boolean=false;
  Consultation:boolean=false;
  caisses:boolean=false;
  journe:boolean=false;
  journal:boolean=false;
  constructor(private router: Router, private authService: AuthService,
              private userService: UserService,
              private token: TokenStorageService, private profilService: ProfilService
    , private modelService: ModelService) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.username = this.authService.getCurrentUser()?.username;
    const username = this.currentUser.username;
    console.log(username);
    this.userService
      .getUserBylogin(username)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user) => {
        this.user = user;

        this.profils = [
          ...this.user.profilUser.map((profilUser) => profilUser.profil),
        ];

        this.getFunctions();
      });
  }

  async getFunctions() {
    const modelFonc: Fonctionalite[] = []; // Array to hold fonctions from all models
    const profilFonc: Fonctionalite[] = []; // Array to hold fonctions from all profils

    for (const profil of this.profils) {
      // Fetch the profile
      const profileData = await this.profilService.getProfileById(profil.idProfil).toPromise();
      if (profileData) {
        profil.fonctions = profileData.fonctions;
        profil.model = profileData.model;

      }


      // Fetch the model and add its fonctions to the modelFonc array
      if (profil.model) {
        const modelData = await this.modelService.getModel(profil.model.idModel).toPromise();

        if (modelData && modelData.fonctions) {
          for (const fonction of modelData.fonctions) {
            if (!modelFonc.find(f => f.idFonc === fonction.idFonc)) {
              modelFonc.push(fonction);
            }
          }
        }
      }

      // Add the profil's fonctions to the profilFonc array
      if (profil.fonctions) {
        for (const fonction of profil.fonctions) {
          if (!profilFonc.find(f => f.idFonc === fonction.idFonc)) {
            profilFonc.push(fonction);
          }
        }
      }
    }

    // Combine the modelFonc and profilFonc arrays, removing duplicates
    const functionsSet = new Set([...modelFonc, ...profilFonc]);
    this.fonctions = Array.from(functionsSet).filter((value, index, self) => self.findIndex(v => v.idFonc === value.idFonc) === index);
    this.sidebarFonctions();
  }

  Logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  sidebarFonctions() {
    for (const item of this.fonctions) {
      switch (item.codF) {
        case '2':
         this.Encaissement_Facture = true;
          break;
          case '30':
         this.journal = true;
          break;
        case '1':
          this.Encaissement = true;
          break;
        case '3':
          this.Paiement_Avance = true;
          break;
        case '4':
          this.Recherche = true;
          break;
        case '5':
          this.Recherche_Encaissement = true;
          break;
        case '6':
          this.Recherche_Facture = true;
          break;
        case '7':
          this.Etat_edition = true;
          break;
        case '8':
          this.E1 = true;
          break;
        case '9':
          this.E2 = true;
          break;
        case '10':
          this.E3 = true;
          break;
        case '11':
          this.ETT = true;
          break;
        case '12':
          this.paiement = true;
          break;
        case '13':
          this.Bordereau = true;
          break;
        case '14':
          this.Generation = true;
          break;
        case '15':
          this.Consultation = true;
          break;
        case '16':
          this.caisses = true;
          break;
        case '17':
          this.journe = true;
          break;
        default:
          break;
      }
    }
  }
}
