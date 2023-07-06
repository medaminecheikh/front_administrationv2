import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {InfoFacture} from "../modules/InfoFacture";

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private baseUrl = 'http://localhost:8088/POS';

  constructor(private http: HttpClient) {
  }

  addFacture(facture: InfoFacture): Observable<InfoFacture> {
    return this.http.post<InfoFacture>(`${this.baseUrl}/facture`, facture);
  }

  getAllFactures(identifiant: string, ref: string, apl: number, page: number, size: number): Observable<InfoFacture[]> {
    const params = {
      identifiant: identifiant,
      ref: ref,
      apl: String(apl),
      page: String(page),
      size: String(size)
    };
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/all`, {params: params});
  }

  getFacturesByUser(idUser: string): Observable<InfoFacture[]> {
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/facturebyuser/${idUser}`);
  }

  updateFacture(idFacture: string, facture: InfoFacture): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/updatefacture/${idFacture}`, facture);
  }

  deleteFacture(idFacture: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${idFacture}`);
  }

  affectEncaissementToFacture(encaissementId: string, factureId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/affectencaissement/${factureId}/${encaissementId}`, {});
  }

  removeEncaissementFromFacture(encaissementId: string, factureId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removencaissement/${factureId}/${encaissementId}`);
  }
}
