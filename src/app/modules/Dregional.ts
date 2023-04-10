import {Ett} from "./Ett";
import { Zone } from "./Zone";

export interface Dregional{
  cod_DR: string
  dr: string
  drAr: string
  etts: Ett[]
  idDr: string
  totalElements: number
  zone: Zone ;
}
