import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Profil} from "../modules/Profil";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  host = "http://localhost:8088/POS";

  constructor(private http: HttpClient) { }

  searchPageProfils(kw: String, page: number, size: number): Observable<Profil[]> {
    return this.http.get<Profil[]>(this.host+"/searchPageProfils?Keyword="+kw+"&page="+page+"&size="+size);
  }

  public getAllProfiles(): Observable<Profil[]> {
    return this.http.get<Profil[]>(`${this.host}/profiles`);
  }

  public addProfile(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>(`${this.host}/ajouteprofile`, profil);
  }

  public getProfileById(idProfile: String): Observable<Profil> {
    return this.http.get<Profil>(`${this.host}/profile/${idProfile}`);
  }

  public updateProfile(profile: Profil): Observable<void> {
    return this.http.put<void>(`${this.host}/update-profile`, profile);
  }

  public affecterFonctionaliteToProfile(idFonc: String, idProfile: String): Observable<void> {
    return this.http.put<void>(`${this.host}/affecterFonctionaliteToProfile/${idFonc}/${idProfile}`, null);
  }

  public removeFonc(idFonc: String, idProfile: String): Observable<void> {
    return this.http.put<void>(`${this.host}/removeFonc/${idFonc}/${idProfile}`, null);
  }

  public affecterModelToProfile(idModel: String, idProfile: String): Observable<void> {
    return this.http.put<void>(`${this.host}/affecterModelToProfile/${idModel}/${idProfile}`, null);
  }

  public removeModelToProfile(idModel: String, idProfile: String): Observable<void> {
    return this.http.put<void>(`${this.host}/removeModelToProfile/${idModel}/${idProfile}`, null);
  }

  public deleteProfile(idProfile: String): Observable<void> {
    return this.http.delete<void>(`${this.host}/deleteProfile/${idProfile}`);
  }

  public removeProfile(idUser: String, idProfil: String): Observable<void> {
    return this.http.put<void>(`${this.host}/removeProfile/${idUser}/${idProfil}`, null);
  }
}
