import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Encaissement} from "../modules/Encaissement";

@Injectable({
  providedIn: 'root'
})
export class EncaissementService {
  private baseUrl = 'http://localhost:8088';

  constructor(private http: HttpClient) {
  }

  addEncaiss(encaissement: Encaissement): Observable<Encaissement> {
    return this.http.post<Encaissement>(`${this.baseUrl}/encaissement`, encaissement);
  }
  updateEncaiss(encaissement: Encaissement): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/encaissementupdate`, encaissement);
  }

  getEncaissById(id: string): Observable<Encaissement> {
    return this.http.get<Encaissement>(`${this.baseUrl}/encaissement/${id}`);
  }
  getEncaissThisYear(): Observable<Encaissement[]> {
    return this.http.get<Encaissement[]>(`${this.baseUrl}/encaissement/thisyear`);
  }

  getEncaissementByFacture(idFact: string): Observable<Encaissement[]> {
    return this.http.get<Encaissement[]>(`${this.baseUrl}/Byfacture/${idFact}`);
  }

  getEncaissementByUser(idUser: string): Observable<Encaissement[]> {
    return this.http.get<Encaissement[]>(`${this.baseUrl}/Byuser/${idUser}`);
  }

  getEncaissementByCaisse(idCaisse: string): Observable<Encaissement[]> {
    return this.http.get<Encaissement[]>(`${this.baseUrl}/Bycaisse/${idCaisse}`);
  }

  deleteEncaiss(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/encaissements/delete/${id}`);
  }

  affectEncaisseToCaisse(idEncaiss: string, idCai: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/affectEncaisseToCaisse/${idEncaiss}/${idCai}`, null);
  }

  getEncaissementsForCaisseInCurrentMonth(caisseId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/encaissements/current-month-for-caisse?caisseId=${caisseId}`);
  }

  searchYearEncaissement(
    produit: string,
    identifiant: string,
    etatEncaissement: string,
    typeIdent: string,
    montantEnc: number,
    refFacture: string,
    page: number,
    size: number
  ): Observable<Encaissement[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('identifiant', identifiant || '')
      .set('etatEncaissement', etatEncaissement || '')
      .set('typeIdent', typeIdent || '')
      .set('montantEnc', montantEnc ? montantEnc.toString() : '')
      .set('refFacture', refFacture || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Encaissement[]>(`${this.baseUrl}/encaissement/searchYearEncaissement`, {params});
  }

  searchWeekEncaissement(
    produit: string,
    identifiant: string,
    etatEncaissement: string,
    typeIdent: string,
    montantEnc: number,
    refFacture: string,
    page: number,
    size: number
  ): Observable<Encaissement[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('identifiant', identifiant || '')
      .set('etatEncaissement', etatEncaissement || '')
      .set('typeIdent', typeIdent || '')
      .set('montantEnc', montantEnc ? montantEnc.toString() : '')
      .set('refFacture', refFacture || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Encaissement[]>(`${this.baseUrl}/encaissement/searchWeekEncaissement`, {params});
  }

  searchMonthEncaissement(
    produit: string,
    identifiant: string,
    etatEncaissement: string,
    typeIdent: string,
    montantEnc: number,
    refFacture: string,
    page: number,
    size: number
  ): Observable<Encaissement[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('identifiant', identifiant || '')
      .set('etatEncaissement', etatEncaissement || '')
      .set('typeIdent', typeIdent || '')
      .set('montantEnc', montantEnc ? montantEnc.toString() : '')
      .set('refFacture', refFacture || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Encaissement[]>(`${this.baseUrl}/encaissement/searchMonthEncaissement`, {params});
  }
}
