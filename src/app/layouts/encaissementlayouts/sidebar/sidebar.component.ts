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

  }

  Logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
