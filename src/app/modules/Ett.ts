import {Utilisateur} from "./Utilisateur";
import {Dregional} from "./Dregional";
import { Zone } from "./Zone";

export interface Ett {
  adr: string;
  codEtt: string;
  cod_CFRX: string;
  des_SRC_ENC: string;
  dregional: Dregional;
  idEtt: string;
  is_BSCS: number;
  prfx_SRC_ENC: string;
  totalElements: number;
  utilisateurs: Utilisateur[];
  zone: Zone;
}
