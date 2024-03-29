import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {InfoFacture} from "../modules/InfoFacture";
import {Encaissement} from "../modules/Encaissement";

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private baseUrl = 'http://localhost:9999/MICROFACTURE';

  constructor(private http: HttpClient) {}

  addFacture(facture: InfoFacture): Observable<InfoFacture> {
    return this.http.post<InfoFacture>(`${this.baseUrl}/facture`, facture);
  }
  addListEncaissToFacture(encaissments: Encaissement[],factureId:string): Observable<InfoFacture[]> {
    return this.http.post<InfoFacture[]>(`${this.baseUrl}/affectlistencaissement/tofacture/${factureId}`, encaissments);
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

  affectEncaissementToFacture(factureId : string, encaissementId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/affectencaissement/tofacture/${factureId}/${encaissementId}`, null);
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
    solde: string,
    status: string,
    page: number,
    size: number
  ): Observable<InfoFacture[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('refFacture', refFacture || '')
      .set('compteFacturation', compteFacturation || '')
      .set('identifiant', identifiant || '')
      .set('montant', montant || '')
      .set('solde', solde || '')
      .set('status', status || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<InfoFacture[]>(`${this.baseUrl}/factures/searchPageFactures`, { params });
  }

  getAllPagesFacture(produit: string,
                     refFacture: string,
                     compteFacturation: string,
                     identifiant: string,
                     montant: string,
                     solde: string,
                     status: string,
                     page: number,
                     size: number
  ): Observable<InfoFacture[]> {
    const params = new HttpParams()
      .set('produit', produit || '')
      .set('refFacture', refFacture || '')
      .set('compteFacturation', compteFacturation || '')
      .set('identifiant', identifiant || '')
      .set('montant', montant || '')
      .set('solde', solde || '')
      .set('status', status || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<InfoFacture[]>(`${this.baseUrl}/factures/getallbypageFactures`, { params });
  }
  getMonthlyFactures(): Observable<InfoFacture[]> {
    const url = `${this.baseUrl}/factures/monthlyFactures`;
    return this.http.get<InfoFacture[]>(url);
  }

  calculateAmountToPay(facture: InfoFacture, date: Date): Observable<number> {
    const url = `${this.baseUrl}/factures/amountopay`;
    const params = new HttpParams().set('date', date.toISOString());

    // Assuming that your InfoFacture object can be sent as JSON in the request body
    const body = JSON.stringify(facture);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<number>(url, body, { params, headers });
  }
  getYearlyFactures(): Observable<InfoFacture[]> {
    const url = `${this.baseUrl}/factures/yearlyFactures`;
    return this.http.get<InfoFacture[]>(url);
  }
}
