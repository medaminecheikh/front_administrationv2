import {Dregional} from "./Dregional";
import {Ett} from "./Ett";

export interface Zone
{
  cod_ZONE: string
  des_ZONE: string
  des_ZONE_AR: string
  dregionals: Dregional[]
  etts: Ett[]
  idZone: string
  totalElements: number
}
