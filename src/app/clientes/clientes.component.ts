import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { ClientesService } from './clientes.service';
import { LStorageService } from '../segu/l-storage.service';

// Interfaz
import { ICliente } from './ICliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  // Interfaz
  mdlClientes: ICliente[];

  // Totales
  totReg = 0;

  constructor(private clientesService: ClientesService, private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    } else {
      this.dameClientes();
    }
  }

  /**********************************************************
    CONSULTA
  **********************************************************/
  dameClientes() {
    // Inicializa modelo
    this.mdlClientes = null;

    // Conecta servicio
    this.clientesService.getClientes()
    .subscribe(cliResult => {
      // console.log('cliResult', cliResult);

      this.successDameClientes(cliResult.clienteResponse.cliente);
    },
    error => {
      console.log('error', error);
    });
  }

  successDameClientes(mdlClientes: ICliente[]) {
    if (mdlClientes.length > 0) {
      this.mdlClientes = mdlClientes;

      // Total registros
      this.totReg = this.mdlClientes.length;
    }
  }

  /**********************************************************
    REGISTROS
  **********************************************************/
  // Nuevo
  nuevoCliente() {
    this.clientesService.vsintClienteId = 0;
    this.clientesService.vsModoEdicion = false;

    this.navega('cliente-det');
  }

  // Edita
  editaCliente(clienteId: number) {
    this.clientesService.vsintClienteId = clienteId;
    this.clientesService.vsModoEdicion = true;

    this.navega('cliente-det');
  }

  // Elimina
  eliminaCliente(clienteId: number) {
    // Conecta servicio
    this.clientesService.deleteCliente(clienteId)
    .subscribe(cliResult => {
      console.log('cliResult', cliResult);

      // Actualiza consulta
      this.dameClientes();
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
