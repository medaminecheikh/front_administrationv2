import {Profil} from "./Profil";
import {Utilisateur} from "./Utilisateur";

export interface ProfilUser {
  categ_PROFIL: string;
  cod_CFRX: string;
  cod_DR: string;
  cod_ETT: string;
  cod_ZONE: string;
  id: number;
  mis_P: string;
  nom_P: string;
  profil: Profil;
  utilisateur: Utilisateur;
}
