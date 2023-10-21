import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Encaissement} from "../modules/Encaissement";

@Injectable({
  providedIn: 'root'
})
export class EncaissementService {
  private baseUrl = 'http://localhost:8088/POS';

  constructor(private http: HttpClient) {
  }

  addEncaiss(encaissement: Encaissement): Observable<Encaissement> {
    return this.http.post<Encaissement>(`${this.baseUrl}/encaissement`, encaissement);
  }

  getEncaissById(id: string): Observable<Encaissement> {
    return this.http.get<Encaissement>(`${this.baseUrl}/encaissement/${id}`);
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
}
