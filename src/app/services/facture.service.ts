import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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

  findAllFactures(identifiant: string, ref: string, apl: number, page: number, size: number): Observable<InfoFacture[]> {
    const params = {
      identifiant: identifiant,
      ref: ref,
      apl: String(apl),
      page: String(page),
      size: String(size)
    };
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/findall`, {params: params});
  }

  getFacturesByUser(idUser: string): Observable<InfoFacture[]> {
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/facturebyuser/${idUser}`);
  }
  getFactures(): Observable<InfoFacture[]> {
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/allfactures`);
  }

  updateFacture( facture: InfoFacture): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/updatefacture/`, facture);
  }

  deleteFacture(idFacture: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletefacture/${idFacture}`);
  }

  affectEncaissementToFacture(encaissementId: string, factureId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/affectencaissement/tofacture/${factureId}/${encaissementId}`, {});
  }

  removeEncaissementFromFacture(encaissementId: string, factureId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removencaissement/${factureId}/${encaissementId}`);
  }

  getAllFactures(identifiant: string, ref: string, apl: number): Observable<InfoFacture[]> {
    const params = {
      identifiant: identifiant,
      ref: ref,
      apl: String(apl)
    };
    return this.http.get<InfoFacture[]>(`${this.baseUrl}/findallfacture`, {params: params});
  }
  searchPageFactures(
    produit: string,
    refFacture: string,
    compteFacturation: string,
    identifiant: string,
    montant: string,
    page: number,
    size: number
  ): Observable<InfoFacture[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('refFacture', refFacture || '')
      .set('compteFacturation', compteFacturation || '')
      .set('identifiant', identifiant || '')
      .set('montant', montant || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<InfoFacture[]>(`${this.baseUrl}/factures/searchPageFactures`, { params });
  }
}
