import {ProfilUser} from "./ProfilUser";
import {Caisse} from "./Caisse";

export interface Utilisateur {
  idUser: String;
  login: String;
  nomP: String;
  nomU: String;
  pwdU: String;
  confirmedpassword: String;
  prenU: String;
  descU: String;
  matricule: String;
  estActif: number;
  f_ADM_LOC: number;
  f_ADM_CEN: number;
  date_CREATION: Date;
  is_EXPIRED: number;
  date_EXPIRED: Date;
  profilUser: ProfilUser[];
  caisse:Caisse;
  totalElements:number;
}


