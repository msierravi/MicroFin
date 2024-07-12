import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { CotizacionesService } from './cotizaciones.service';
import { LStorageService } from '../segu/l-storage.service';

// Interfaz
import { ICotizacionesQry, IAmortizacionesQry } from '../creditos/ICredito';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

    // Interfaz
    mdlCotizaciones: ICotizacionesQry[];
    mdlAmortizaciones: IAmortizacionesQry[];

    // Totales
    totReg = 0;

  constructor(private cotizacionesService: CotizacionesService, private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    } else {
      this.dameCotizaciones();
    }
  }

  /**********************************************************
    CONSULTA
  **********************************************************/
    dameCotizaciones() {
      // Inicializa modelo
      this.mdlCotizaciones = null;

      this.cotizacionesService.getCotizaciones()
      .subscribe(cotResult => {
        console.log('cotResult', cotResult);

        this.successDameCotizaciones(cotResult.creditoResponse.credito);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameCotizaciones(mdlCotizaciones: ICotizacionesQry[]) {
      if (mdlCotizaciones.length > 0) {
        this.mdlCotizaciones = mdlCotizaciones;

        // Total registros
        this.totReg = this.mdlCotizaciones.length;
      }
    }

  /**********************************************************
    REGISTROS
  **********************************************************/
  // Nuevo
  nuevaCotizacion() {
    this.cotizacionesService.vsintCreditoId_Cotiza = 0;
    this.cotizacionesService.vsModoEdicion = false;

    this.navega('cotizacion-det');
  }

  // Edita
  editaCotizacion(creditoCotizaId: number) {
    this.cotizacionesService.vsintCreditoId_Cotiza = creditoCotizaId;
    this.cotizacionesService.vsModoEdicion = true;

    this.navega('cotizacion-det');
  }

  // Elimina
  eliminaCotizacion(creditoCotizaId: number) {
    // Conecta servicio

    // Actualiza consulta
    this.dameCotizaciones();
  }

  /**********************************************************
    NAVEGACION
  **********************************************************/
  navega(pagina: string) {
    const irPagina: string = pagina;
    this.router.navigate([irPagina]);
  }
}
