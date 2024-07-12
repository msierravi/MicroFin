import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse } from './IPago';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  // Url
  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

    // Obtiene pagos
    getPagos(amortizaId: number): Observable<IResponse> {
      return this.http.get<IResponse>(this.url + '/pagos/' + String(amortizaId), { });
    }

    // Obtiene saldos a favor
    getSaldoFavorNoAplica(creditoId: number): Observable<IResponse> {
      return this.http.get<IResponse>(this.url + '/saldos_fav_noapli/' + String(creditoId), { });
    }

    // Inserta pago
    getInsertaPago(creditoId: number, formaPagoId: number, montoPago: number, fecPago: Date,
                   saldoFavorId: number): Observable<IResponse> {
      let strParam: string;
      strParam = '/' + String(creditoId);
      strParam += '/' + String(formaPagoId);
      strParam += '/' + String(montoPago);
      strParam += '/' + String(fecPago);
      strParam += '/' + String(saldoFavorId);

      return this.http.get<IResponse>(this.url + '/ins_pago' + strParam, { });
    }
}
