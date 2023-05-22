import {ProfilUser} from "./ProfilUser";
import {Model} from "./Model";
import {Fonctionalite} from "./Fonctionalite";

class CategProfil {
}

export interface Profil {
  categProfil: CategProfil;
  des_P: string
  fonctions:Set<Fonctionalite>;
  idProfil: string;
  model: Model;
  nomP: string;
  profilUsers: ProfilUser[];
  totalElements: number;
}
