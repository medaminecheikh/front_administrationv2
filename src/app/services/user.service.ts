import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Utilisateur} from "../modules/Utilisateur";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  host = "http://localhost:8088/POS/";
  constructor(private http: HttpClient) { }
  public searchUserpage(kw: string, nom: string, prenom: string, page: number, size: number):Observable<Utilisateur[]>{
    const params = new HttpParams()
      .set('Keyword', kw)
      .set('Nom', nom)
      .set('Prenom', prenom)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Utilisateur[]>(`${this.host}searchPageUsers`, { params });
  }
  public addUser(user:Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>(this.host+"ajouteutilisateur",user);
  }
  public updateUser(user:Utilisateur){
    return this.http.put(this.host+"update-utilisateur",user);
  }
  public getUserById(id:String):Observable<Utilisateur>{
    return this.http.get<Utilisateur>(this.host+"utilisateur/"+id);
  }
  public affectProfilToUser(idUser:String,idProfile:String){
    return this.http.put(this.host+"affecterProfiletoUser/"+idUser+"/"+idProfile,null);
  }
  public deleteUser(idUser:String){
    return this.http.delete(this.host+"deleteUser/"+idUser);
  }
  public removeProfil(idUser:String,idProfil:String){
    return this.http.put(this.host+"removeProfile/"+idUser+"/"+idProfil,null);
  }
  public affecterUserToEtt(idUser: String, idEtt: String): Observable<any> {
    return this.http.put(`${this.host}affecterUserToEtt/${idUser}/${idEtt}`, {});
  }
  public getUserBylogin(login:String):Observable<Utilisateur>{
    return this.http.get<Utilisateur>(this.host+"utilisateurlogin/"+login);
  }
}
