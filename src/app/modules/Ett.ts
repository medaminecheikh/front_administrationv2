import {Utilisateur} from "./Utilisateur";
import {Dregional} from "./Dregional";
import { Zone } from "./Zone";
import {Caisse} from "./Caisse";

export interface Ett {
  adr: string;
  codEtt: string;
  cod_CFRX: string;
  des_SRC_ENC: string;
  dregional: Dregional;
  idEtt: string;
  caisses:Caisse[];
  is_BSCS: number;
  prfx_SRC_ENC: string;
  totalElements: number;
  utilisateurs: Utilisateur[];
  zone: Zone;
}
