import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse } from './IUsuario';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  // Url
  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obtiene consulta
  getUsuarios(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/usuarios', { });
  }

  // Valida si existe el usuario
  getLogin(email: string, pwd: string): Observable<IResponse> {
    const aParam = [];
    aParam.push(email);
    aParam.push(pwd);

    return this.http.get<IResponse>(this.url + '/login', {
      params: { aParam }
    });
  }
}
