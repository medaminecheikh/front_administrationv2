import {InfoFacture} from "./InfoFacture";
import {Encaissement} from "./Encaissement";



export interface OperationEncai {
  idOp: number;
  facture: InfoFacture;
  encaissement: Encaissement;
  total: number;
}
