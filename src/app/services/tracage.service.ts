import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Tracage} from "../modules/Tracage";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TracageService {
  host = "http://localhost:8088/POS/";
  constructor(private http: HttpClient) { }
  getTracages(
    idUser: string,
    time: Date,
    ip: string,
    browser: string,
    op: string
  ): Observable<Tracage[]> {
    // Set up query parameters
    let params = new HttpParams()
      .set('idUser', idUser)
      .set('time', time ? time.toISOString() : '')
      .set('ip', ip)
      .set('browser', browser)
      .set('op', op);

    return this.http.get<Tracage[]>(`${this.host}tracages`, { params });
  }

  addTracage(tracage: Tracage): Observable<void> {
    // Get browser information
    // Assign gathered information to the tracage object
      tracage.browser = navigator.userAgent;


      // Send the tracage object through HTTP POST request
     return this.http.post<void>(`${this.host}/addtracage`, tracage);
  }


  getTracagebyencaissement(): Observable<Tracage[]> {
    return this.http.get<Tracage[]>(`${this.host}tracagesencaisssement`);
  }
  getTracagebyfacture(): Observable<Tracage[]> {
    return this.http.get<Tracage[]>(`${this.host}tracagesfacture`);
  }
  getTracagebycaisse(): Observable<Tracage[]> {
    return this.http.get<Tracage[]>(`${this.host}tracagescaisse`);
  }
}
