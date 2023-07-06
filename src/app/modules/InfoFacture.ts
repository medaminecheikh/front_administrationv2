import {Utilisateur} from "./Utilisateur";
import {OperationEncai} from "./OperationEncai";

export interface InfoFacture {
  idFacture: string;
  refFacture: string;
  produit: string;
  montant: number;
  solde: number;
  nAppel: number;
  codeClient: string;
  compteFacturation: string;
  typeIdent: string;
  identifiant: string;
  datLimPai: Date;
  periode: string;
  encaissements: OperationEncai[];
  user: Utilisateur;
}
