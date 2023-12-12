import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Ett} from "../modules/Ett";

@Injectable({
  providedIn: 'root'
})
export class EttService {
  private baseUrl = 'http://localhost:8088';
  constructor(private http: HttpClient) { }

  getAllEtts(): Observable<Ett[]> {
    return this.http.get<Ett[]>(`${this.baseUrl}/etts`);
  }

  addEtt(ett: Ett): Observable<Ett> {
    return this.http.post<Ett>(`${this.baseUrl}/ajouteett`, ett);
  }

  getEtt(id: String): Observable<Ett> {
    return this.http.get<Ett>(`${this.baseUrl}/ett/${id}`);
  }

  updateEtt(ett: Ett): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-ett`, ett);
  }

  affecterEttToZone(idZone: String, idEtt: String): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/affecterEttToZone/${idZone}/${idEtt}`, {});
  }

  affecterEttToDreg(idEtt: String, idDreg: String): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/affecterEttToDregional/${idEtt}/${idDreg}`, {});
  }

  removeZone(idZone: String): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/removeZone/${idZone}`, {});
  }

  deleteEtt(idEtt: String): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteEtt/${idEtt}`);
  }

  getEttsByDrId(drId: String): Observable<Ett[]> {
    return this.http.get<Ett[]>(`${this.baseUrl}/ettbydr/${drId}`);
  }
}
