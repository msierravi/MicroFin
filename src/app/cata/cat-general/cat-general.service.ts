import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
import { IResponse } from './ICatGeneral';

@Injectable({
  providedIn: 'root'
})
export class CatGeneralService {

  // Dirección de la página
  url = 'http://localhost:8080/api';

  // Variables de intercambio
  viNumeroCatalogo = 0;
  viCatalogoId = 0;
  viModoEdicion = false;

  constructor(private http: HttpClient) { }

  // Obtiene consulta
  getCatGenerales(numeroCatalogo: number, catalogoId: number, usuarioId: number): Observable<IResponse> {
    const aParam = [];
    aParam.push(numeroCatalogo);
    aParam.push(catalogoId);
    aParam.push(usuarioId);

    return this.http.get<IResponse>(this.url + '/cat_general', {
      params: { aParam }
    });
  }

  // Crea registro
  createCatGeneral(numeroCatalogo: number, descripcion: string, conIdentity: boolean, usuarioId: number): Observable<IResponse> {
      const aParam = [];
      aParam.push(numeroCatalogo);
      aParam.push(descripcion);
      aParam.push(conIdentity);
      aParam.push(usuarioId);

      return this.http.get<IResponse>(this.url + '/ins_cat_general', {
        params: { aParam }
      });
  }

  // Actualiza registro
  updateCatGeneral(numeroCatalogo: number, catalogoId: number, descripcion: string, usuarioId: number): Observable<IResponse> {
    const aParam = [];
    aParam.push(numeroCatalogo);
    aParam.push(catalogoId);
    aParam.push(descripcion);
    aParam.push(usuarioId);

    return this.http.get<IResponse>(this.url + '/upd_cat_general', {
      params: { aParam }
    });
  }

  // Elimina registro
  deleteCatGeneral(numeroCatalogo: number, catalogoId: number, usuarioId: number): Observable<IResponse> {
    const aParam = [];
    aParam.push(numeroCatalogo);
    aParam.push(catalogoId);
    aParam.push(usuarioId);

    return this.http.get<IResponse>(this.url + '/del_cat_general', {
      params: { aParam }
    });
  }

}
