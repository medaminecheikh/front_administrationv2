import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Fonctionalite} from "../modules/Fonctionalite";

@Injectable({
  providedIn: 'root'
})
export class FonctionService {
  private baseUrl = 'http://localhost:9999/MICROADMIN';

  constructor(private http: HttpClient) { }

  getAllFoncs(): Observable<Fonctionalite[]> {
    return this.http.get<Fonctionalite[]>(`${this.baseUrl}/foncs`);
  }

  addFonc(foncRequestDTO: Fonctionalite): Observable<Fonctionalite> {
    return this.http.post<Fonctionalite>(`${this.baseUrl}/ajoutefonc`, foncRequestDTO);
  }
  addsousFonc(foncRequestDTO: Fonctionalite): Observable<Fonctionalite> {
    return this.http.post<Fonctionalite>(`${this.baseUrl}/ajoutesousfonc`, foncRequestDTO);
  }

  getFoncById(idFonc: String): Observable<Fonctionalite> {
    return this.http.get<Fonctionalite>(`${this.baseUrl}/fonc/${idFonc}`);
  }

  updateFonc(foncUpdateDTO: Fonctionalite): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-fonc/`, foncUpdateDTO);
  }

  affecterModelToFonc(idModel: String, idFonc: String): Observable<any> {
    return this.http.put(`${this.baseUrl}/affecterModelToFonc/${idModel}/${idFonc}`, null);
  }

  deleteFonc(idFonc: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteFonctionalite/${idFonc}`);
  }

  removeModel(idModel: String, idFonc: String): Observable<any> {
    return this.http.put(`${this.baseUrl}/removeModel/${idModel}/${idFonc}`, null);
  }

  getFonctionsByNomMenu(nomMenu: string): Observable<Fonctionalite[]> {
    return this.http.get<Fonctionalite[]>(`${this.baseUrl}/bymenu/${nomMenu}`);
  }
}
