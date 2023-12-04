import {Utilisateur} from "./Utilisateur";

export interface Tracage {
  idTrace: number;
  typeOp: string;
  object: string;
  browser: string;
  ip: string;
  time: string;
  utilisateur: Utilisateur;
}
