import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Caisse} from "../modules/Caisse";

@Injectable({
  providedIn: 'root'
})
export class CaisseService {

  private baseUrl = 'http://localhost:8088/caisse';

  constructor(private http: HttpClient) { }

  addCaisse(caisseRequestDTO: Caisse): Observable<Caisse> {
    return this.http.post<Caisse>(`${this.baseUrl}/add`, caisseRequestDTO);
  }

  getCaisse(id: string): Observable<Caisse> {
    return this.http.get<Caisse>(`${this.baseUrl}/add/${id}`);
  }

  listCaisses(): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/getall`);
  }

  updateCaisse( caisseUpdateDTO: Caisse): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update/`, caisseUpdateDTO);
  }

  affecterCaisseToUser(idCaisse: string, idUser: String): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${idCaisse}/utilisateurs/${idUser}`, {});
  }

  removeUser(idUser: String): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/utilisateurs/${idUser}`);
  }

  affecterCaisseToEtt(idCaisse: string, idEtt: String): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/affect/${idCaisse}/etts/${idEtt}`, {});
  }

  deleteCaisse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getCaissesByEttId(id: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/etts/${id}`);
  }
}
