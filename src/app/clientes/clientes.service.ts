import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse, ICliente } from './ICliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  // Variables
  vsModoEdicion = false;
  vsintClienteId = 0;

  // Url
  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
  }

   // Obtiene consulta
   getClientes(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/clientes', { });
  }

  // Obtiene catalogo
  getClienteCat(porCliente: boolean): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/clientes_cat/' + String(porCliente), { });
  }

  // Optiene un registro
  getCliente(id: number): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/cliente/' + String(id), { });
  }

  // Crea registro
  createCliente(mdlCliente: ICliente): Observable<IResponse> {
    return this.http.post<IResponse>(this.url + '/ins_cliente', mdlCliente);
  }

  // Actualiza registro
  updateCliente(mdlCliente: ICliente): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/upd_cliente/' + String(mdlCliente.id), mdlCliente, {  });
  }

  // Elimina registro
  deleteCliente(id: number): Observable<IResponse> {
    return this.http.delete<IResponse>(this.url + '/del_cliente/' + String(id));
  }
}
