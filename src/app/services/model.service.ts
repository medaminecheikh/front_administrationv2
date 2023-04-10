import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Model} from "../modules/Model";

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private readonly host = 'http://localhost:8088/POS';

  constructor(private http: HttpClient) {}

  public getAllModels(): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.host}/models`);
  }

  public addModel(model: Model): Observable<Model> {
    return this.http.post<Model>(`${this.host}/ajoutemodel`, model);
  }

  public getModel(idModel: string): Observable<Model> {
    return this.http.get<Model>(`${this.host}/model/${idModel}`);
  }

  public updateModel(model: Model): Observable<void> {
    return this.http.put<void>(`${this.host}/update-model/`, model);
  }

  public deleteModel(idModel: string): Observable<void> {
    return this.http.delete<void>(`${this.host}/deleteModel/${idModel}`);
  }
}
