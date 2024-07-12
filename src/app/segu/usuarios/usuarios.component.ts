import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { SeguridadService } from '../seguridad.service';
import { LStorageService } from '../l-storage.service';

// Interfaz
import { IUsuario } from '../IUsuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  // Interfaz
  mdlUsuarios: IUsuario[];

  // Totales
  totReg = 0;

  constructor(private seguridadService: SeguridadService, private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    } else {
      this.dameUsuarios();
    }
  }

  /**********************************************************
    CONSULTA
  **********************************************************/
    dameUsuarios() {
      // Inicializa modelo
      this.mdlUsuarios = null;

      // Conecta servicio
      this.seguridadService.getUsuarios()
      .subscribe(usuResult => {
        // console.log('usuResult', usuResult);

        this.successDameUsuarios(usuResult.usuarioResponse.usuario);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameUsuarios(mdlUsuarios: IUsuario[]) {
      if (mdlUsuarios.length > 0) {
        this.mdlUsuarios = mdlUsuarios;

        // Total registros
        this.totReg = this.mdlUsuarios.length;
      }
    }
}
