import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse, IResponseAmort } from '../creditos/ICredito';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

    // Variables
    vsModoEdicion = false;
    vsintCreditoId = 0;

    // Url
    url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
    // Obtiene consulta
    getCreditos(clienteId: number, inmuebleId: number): Observable<IResponse> {
      return this.http.get<IResponse>(this.url + '/creditos/' + String(clienteId) + '/' + String(inmuebleId), { });
    }

    // Obtiene amortizaciones del crédito
    getAmortizaCred(creditoId: number): Observable<IResponseAmort> {
      return this.http.get<IResponseAmort>(this.url + '/amortiza_cred/' + String(creditoId), { });
    }
}
