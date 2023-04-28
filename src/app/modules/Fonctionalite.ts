import {Profil} from "./Profil";
import {Model} from "./Model";

export interface Fonctionalite {
  codF: string;
  desF: string;
  f_ADM: number;
  f_DROIT_ACCES: number;
  fon_COD_F: string;
  idFonc: string;
  models: Model[];
  nomF: string;
  nomMENU: string;
  profils: Profil[];
  children?: Fonctionalite[];
  totalElements: number;
}
