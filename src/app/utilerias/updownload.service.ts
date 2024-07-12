import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest , HttpEvent, HttpResponse, HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdownloadService {

  // Dirección de la página
  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Descarga archivo
  getReporte(rptNumero: number, id: number): Observable<HttpEvent<Blob>> {
    const param = String(rptNumero) + '/' + String(id);

    return this.http.request(new HttpRequest('GET', this.url + '/getRpt/' + param, null,
      {
        reportProgress: true,
        responseType: 'blob' as 'json'
      }));
  }
}
