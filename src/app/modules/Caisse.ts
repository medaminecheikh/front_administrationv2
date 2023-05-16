import {Utilisateur} from "./Utilisateur";
import {Ett} from "./Ett";

export interface Caisse{
  idCaisse:String;
  numCaise:number;
  f_Actif:String;
  login:Utilisateur;
  cod_ett:Ett;
}
