import {Utilisateur} from "./Utilisateur";
import {Encaissement} from "./Encaissement";

export interface InfoFacture {
  idFacture: string;
  refFacture: string;
  produit: string;
  montant: number;
  solde: number;
  nappel: number;
  codeClient: string;
  compteFacturation: string;
  typeIdent: string;
  identifiant: string;
  datLimPai: Date;
  periode: string;
  encaissements: Encaissement[];
  user: Utilisateur;
}
