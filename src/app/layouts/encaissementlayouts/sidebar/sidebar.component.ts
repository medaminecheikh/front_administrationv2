import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";

import {Profil} from "../../../modules/Profil";
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {Utilisateur} from "../../../modules/Utilisateur";
import {Fonctionalite} from "../../../modules/Fonctionalite";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  fonctions:Fonctionalite[]=[];
  profils: Profil[] = [];
  currentUser!:any;
  user!:Utilisateur;
  constructor(private router: Router,private userService:UserService,private token:TokenStorageService) {
  }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    console.log( this.currentUser )
    const username = this.currentUser.username;
    console.log(username)
    this.userService.getUserBylogin(username).subscribe((user) => {
      this.user = user;
      console.log(this.user)
      this.profils = [
        ...this.user.profilUser.map((profilUser) => profilUser.profil)
      ];
      console.log(this.profils)
      this.getFonctions();
    });

  }
  getFonctions() {
    this.fonctions = []; // initialize fonctions to an empty array
    this.profils.forEach(profil => {
      this.fonctions = this.fonctions.concat(profil.functions, profil.model.fonctions);
      console.log(this.fonctions)
    });
  }

}
