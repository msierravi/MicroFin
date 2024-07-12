import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse } from './IFormaPago';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  // Url
  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
  }

   // Obtiene consulta
   getCatFormasPago(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/cat_formas_pago', { });
  }
}
