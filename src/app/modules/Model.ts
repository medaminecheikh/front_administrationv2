import {Profil} from "./Profil";
import {Fonctionalite} from "./Fonctionalite";

export interface Model {
  desMOD: string;
  fonctions: Fonctionalite[];
  idModel: string;
  obs: string;
  profils: Profil[];
  totalElements: number;
}
