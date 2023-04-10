import { Injectable } from '@angular/core';
import {Dregional} from "../modules/Dregional";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DrService {
  private baseUrl = 'http://localhost:8088/POS';
  constructor(private http: HttpClient) { }

  public getAllDregionals(): Observable<Dregional[]> {
    return this.http.get<Dregional[]>(`${this.baseUrl}/dregionals`);
  }

  public addDregional(dregRequestDTO: Dregional): Observable<Dregional> {
    return this.http.post<Dregional>(`${this.baseUrl}/ajouteDreg`, dregRequestDTO);
  }

  public getDregional(idDregional: string): Observable<Dregional> {
    return this.http.get<Dregional>(`${this.baseUrl}/dreg/${idDregional}`);
  }

  public updateDregionalDTO(dto: Dregional): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-dreg/`, dto);
  }

  public getDregionalsByZone(idZone: string): Observable<Dregional[]> {
    return this.http.get<Dregional[]>(`${this.baseUrl}/dregbyzone/${idZone}`);
  }
}
