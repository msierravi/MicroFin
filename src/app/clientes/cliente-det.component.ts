import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios
import { ClientesService } from './clientes.service';

// Interfaz
import { ICliente } from './ICliente';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrls: ['./cliente-det.component.css']
})
export class ClienteDetComponent implements OnInit {

  // Edicion
  regEdita = false;
  modoEdicion: string;

  // Formulario
  formCliente = new FormGroup({
    id: new FormControl(0),
    vchNombre: new FormControl(''),
    vchApellidoPaterno: new FormControl(''),
    vchApellidoMaterno: new FormControl(''),
    vchDomicilio: new FormControl(''),
    bitEsCliente: new FormControl(true)
  });

  // ID cliente
  intClienteId = 0;

  constructor(private clientesService: ClientesService, private router: Router) { }

  ngOnInit() {
    // Obtiene datos
    this.intClienteId = this.clientesService.vsintClienteId;
    this.regEdita = this.clientesService.vsModoEdicion;

    // Determina modo de edicion
    this.modoEdicion = this.regEdita ? 'Edición' : 'Nuevo';

    if (this.regEdita) {
      this.dameCliente();
    } else {
      // Inicializa formulario
      this.iniForm();
    }
  }

  /**********************************************************
    FORMULARIO
  **********************************************************/
  // Inicializa
  iniForm() {
    this.formCliente.patchValue({
      id: 0,
      vchNombre: '',
      vchApellidoPaterno: '',
      vchApellidoMaterno: '',
      vchDomicilio: '',
      bitEsCliente: true
    });
  }

  // Obtiene datos
  dameCliente() {
    // Conecta servicio
    this.clientesService.getCliente(this.intClienteId)
    .subscribe(cliResult => {
      // console.log('cliResult', cliResult);

      this.successDameCliente(cliResult.clienteResponse.clienteUno);
    },
    error => {
          console.log('error', error);
    });
  }

  successDameCliente(mdlCliente: ICliente) {
    this.formCliente.patchValue({
      id: mdlCliente.id,
      vchNombre: mdlCliente.vchNombre,
      vchApellidoPaterno: mdlCliente.vchApellidoPaterno,
      vchApellidoMaterno: mdlCliente.vchApellidoMaterno,
      vchDomicilio: mdlCliente.vchDomicilio,
      bitEsCliente: mdlCliente.bitEsCliente
    });
  }

  // Guarda informacion
  guardaCliente() {
    // Valida nombre
    if (!this.validaTxt('Nombre (s)', this.formCliente.get('vchNombre').value, false, 80)) { return; }
    if (this.formCliente.get('vchApellidoPaterno').value === '' && this.formCliente.get('vchApellidoMaterno').value === '' ) {
      alert('Debe capturar uno de los dos apellidos');
      return;
    } else {
      if (!this.validaTxt('Apellido paterno', this.formCliente.get('vchApellidoPaterno').value, true, 80)) { return; }
      if (!this.validaTxt('Apellido materno', this.formCliente.get('vchApellidoMaterno').value, true, 80)) { return; }
    }

    // Inicializa modelo
    const mdlCliente: ICliente = Object.assign({},
      { id: this.intClienteId },
      { vchNombre: this.formCliente.get('vchNombre').value },
      { vchApellidoPaterno: this.formCliente.get('vchApellidoPaterno').value },
      { vchApellidoMaterno: this.formCliente.get('vchApellidoMaterno').value },
      { vchDomicilio: this.formCliente.get('vchDomicilio').value },
      { bitEsCliente: Boolean(this.formCliente.get('bitEsCliente').value) }
    );

    // Segun modo conecta servicio
    if (this.regEdita) {
        // Actualiza
        this.clientesService.updateCliente(mdlCliente)
          .subscribe(cliResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
      } else {
        // Nuevo
        this.clientesService.createCliente(mdlCliente)
          .subscribe(cliResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
    }
  }

  successGuardado(edita: boolean) {
    if (edita) {
      alert('Cliente modificado');
    } else {
      alert('Cliente registrado');
    }

    this.navega('clientes');
  }

  // Valida campo texto
  validaTxt(nombreCampo: string, texto: string, permiteVacio: boolean, largoTxt: number): boolean {
    const resp = true;

    if (!permiteVacio && texto.trim() === '') {
      alert('Capture ' + nombreCampo);
      return false;
    }

    if (texto.length > largoTxt) {
      alert('El número de caracteres permitidos en el campo ' + nombreCampo + ' es de ' + String(largoTxt) + ', corrija');
      return false;
    }

    return resp;
  }

  /**********************************************************
    NAVEGACION
  **********************************************************/
  navega(pagina: string) {
    const irPagina: string = pagina;
    this.router.navigate([irPagina]);
  }
}
