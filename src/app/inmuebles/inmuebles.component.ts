import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { InmueblesService } from './inmuebles.service';
import { LStorageService } from '../segu/l-storage.service';

// Interfaz
import { IInmuebleQry } from './IInmueble';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.css']
})
export class InmueblesComponent implements OnInit {

  // Interfaz
  mdlInmuebles: IInmuebleQry[];

  // Totales
  totReg = 0;

  constructor(private inmueblesService: InmueblesService, private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    } else {
      this.dameInmuebles();
    }
  }

  /**********************************************************
    CONSULTA
  **********************************************************/
    dameInmuebles() {
      // Inicializa modelo
      this.mdlInmuebles = null;

      // Conecta servicio
      this.inmueblesService.getInmuebles()
      .subscribe(inmResult => {
        console.log('inmResult', inmResult);

        this.successDameInmuebles(inmResult.inmuebleResponse.inmueble);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameInmuebles(mdlInmuebles: IInmuebleQry[]) {
      if (mdlInmuebles.length > 0) {
        this.mdlInmuebles = mdlInmuebles;

        // Total registros
        this.totReg = this.mdlInmuebles.length;
      }
    }

  /**********************************************************
    REGISTROS
  **********************************************************/
  // Nuevo
  nuevoInmueble() {
    this.inmueblesService.vsintInmuebleId = 0;
    this.inmueblesService.vsModoEdicion = false;

    this.navega('inmueble-det');
  }

  // Edita
  editaInmueble(inmuebleId: number) {
    this.inmueblesService.vsintInmuebleId = inmuebleId;
    this.inmueblesService.vsModoEdicion = true;

    this.navega('inmueble-det');
  }

  // Elimina
  eliminaInmueble(inmuebleId: number) {
    // Conecta servicio
    this.inmueblesService.deleteInmueble(inmuebleId)
    .subscribe(inmResult => {
      console.log('inmResult', inmResult);

      // Actualiza consulta
      this.dameInmuebles();
    },
    error => {
      console.log('error', error);
    });
  }

  /**********************************************************
    NAVEGACION
  **********************************************************/
    navega(pagina: string) {
      const irPagina: string = pagina;
      this.router.navigate([irPagina]);
    }
}
