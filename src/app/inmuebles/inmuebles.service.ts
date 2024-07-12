import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz
import { IResponse, IInmueble } from './IInmueble';

@Injectable({
  providedIn: 'root'
})
export class InmueblesService {

    // Variables
    vsModoEdicion = false;
    vsintInmuebleId = 0;

    // Url
    url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obtiene consulta
  getInmuebles(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/inmuebles', { });
  }

  // Obtiene catalogo
  getInmuebleCat(): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/inmuebles_cat', { });
  }

  // Optiene un registro
  getInmueble(id: number): Observable<IResponse> {
    return this.http.get<IResponse>(this.url + '/inmueble/' + String(id), { });
  }

  // Crea registro
  createInmueble(mdlInmueble: IInmueble): Observable<IResponse> {
    return this.http.post<IResponse>(this.url + '/ins_inmueble', mdlInmueble);
  }

  // Actualiza registro
  updateInmueble(mdlInmueble: IInmueble): Observable<IResponse> {
    return this.http.put<IResponse>(this.url + '/upd_inmueble/' + String(mdlInmueble.id), mdlInmueble, {  });
  }

  // Elimina registro
  deleteInmueble(id: number): Observable<IResponse> {
    return this.http.delete<IResponse>(this.url + '/del_inmueble/' + String(id));
  }
}
