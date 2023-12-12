import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { Zone } from '../modules/Zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  host = "http://localhost:8088/";
  constructor(private http: HttpClient) { }
  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.host}zones`);
  }

  addZone(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(`${this.host}ajoutezone`, zone);
  }

  getZone(id: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.host}zone/${id}`);
  }

  updateZone(zone: Zone): Observable<void> {
    return this.http.put<void>(`${this.host}update-zone`, zone);
  }

  affecterDregToZone(idDreg: string, idZone: string): Observable<void> {
    return this.http.put<void>(`${this.host}affecterDregToZone/${idDreg}/${idZone}`, null);
  }

  removeDreg(idDreg: string): Observable<void> {
    return this.http.put<void>(`${this.host}removeDreg/${idDreg}`, null);
  }

  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.host}DeleteZone/${id}`);
  }
}
