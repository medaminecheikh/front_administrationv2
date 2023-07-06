import {Utilisateur} from "./Utilisateur";
import {Caisse} from "./Caisse";
import {OperationEncai} from "./OperationEncai";

export interface Encaissement {
  idEncaissement: string;
  dateEnc: Date;
  montantEnc: number;
  etatEncaissement: string;
  numRecu: string;
  refFacture: string;
  nAppel: number;
  codeClient: string;
  compteFacturation: string;
  typeIdent: string;
  identifiant: string;
  periode: string;
  produit: string;
  modePaiement: string;
  numCheq: string;
  rib: string;
  banque: string;
  agenceBQ: string;
  nTransTPE: string;
  refBordereau: string;
  user: Utilisateur;
  caisse: Caisse;
  operationEncai: OperationEncai;
}
