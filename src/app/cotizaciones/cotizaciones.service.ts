import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { ICredito, IResponse, IResponseAmort } from '../creditos/ICredito';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

    // Variables
    vsModoEdicion = false;
    // tslint:disable-next-line:variable-name
    vsintCreditoId_Cotiza = 0;

    // Url
    url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
  }

  // Obtiene consulta
  getCotizaciones(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/cotizaciones', { });
  }

  // Obtiene un registro
  getCotizacion(id: number): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/cotiza_credito/' + String(id), { });
  }

  // Obtiene tabla de amortización
  getTablaAmortiza(cotizaCreditoId: number): Observable<IResponseAmort> {
    return this.http.get<IResponseAmort>(this.url + '/amortizaciones/' + String(cotizaCreditoId), { });
  }

  // Genera tabla de amortización
  getTablaCotiza(inmuebleId: number, porcEnganche: number, plazo: number, tasaInteres: number): Observable<IResponse> {
    let aParam = '';
    aParam = String(inmuebleId) + '/' + String(porcEnganche) + '/' + String(plazo) + '/' + String(tasaInteres);

    return this.http.get<IResponse>(this.url + '/cotizacion/' + aParam, { });
  }

  // Crea registro
  createCotizacion(mdlCredito: ICredito): Observable<IResponse> {
    return this.http.post<IResponse>(this.url + '/ins_cotizacion', mdlCredito);
  }

  // Actualiza registro
  updateCotizacion(mdlCredito: ICredito): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/upd_cotizacion/' + String(mdlCredito.id), mdlCredito, {  });
  }

  // Formaliza credito
  updateFormalizaCred(id: number, clienteId: number): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/upd_formaliza/' + String(id) + '/' + String(clienteId), {  });
  }
}
