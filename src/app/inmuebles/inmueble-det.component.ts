import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// Servicios
import { InmueblesService } from './inmuebles.service';

// Interfaz
import { IInmueble } from './IInmueble';
import { EST_INMUEBLE } from '../utilerias/constantes';

@Component({
  selector: 'app-inmueble-det',
  templateUrl: './inmueble-det.component.html',
  styleUrls: ['./inmueble-det.component.css']
})
export class InmuebleDetComponent implements OnInit {

  // Edicion
  regEdita = false;
  modoEdicion: string;

  // Formulario
  formInmueble = new FormGroup({
    id: new FormControl(0),
    vchInmueble: new FormControl(''),
    vchDomCalle: new FormControl(''),
    vchDomNumero: new FormControl(''),
    vchDomColonia: new FormControl(''),
    vchDomLocalidad: new FormControl(''),
    vchDomAlcaMun: new FormControl(''),
    vchCodigoPostal: new FormControl(''),
    numValorVenta: new FormControl(0),
    intEstatusId: new FormControl(0)
  });

  // ID inmueble
  intInmuebleId = 0;

  // Formato
  decP = new DecimalPipe('es-MX');
  formatDec = '1.2-2';
  formatDecSeis = '1.6';

  constructor(private inmueblesService: InmueblesService, private router: Router) { }

  ngOnInit() {
    // Obtiene datos
    this.intInmuebleId = this.inmueblesService.vsintInmuebleId;
    this.regEdita = this.inmueblesService.vsModoEdicion;

    // Determina modo de edicion
    this.modoEdicion = this.regEdita ? 'Edición' : 'Nuevo';

    if (this.regEdita) {
      this.dameInmueble();
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
    this.formInmueble.patchValue({
      id: 0,
      vchInmueble: '',
      vchDomCalle: '',
      vchDomNumero: '',
      vchDomColonia: '',
      vchDomLocalidad: '',
      vchDomAlcaMun: '',
      vchCodigoPostal: '',
      numValorVenta: '0.00',
      intEstatusId: 0
    });
  }

  // Obtiene datos
  dameInmueble() {
    // Conecta servicio
    this.inmueblesService.getInmueble(this.intInmuebleId)
    .subscribe(inmResult => {
      // console.log('inmResult', inmResult);

      this.successDameInmueble(inmResult.inmuebleResponse.inmuebleUno);
    },
    error => {
          console.log('error', error);
    });
  }

  successDameInmueble(mdlInmueble: IInmueble) {
    if (mdlInmueble) {
      this.formInmueble.patchValue({
        id: mdlInmueble.id,
        vchInmueble: mdlInmueble.vchInmueble,
        vchDomCalle: mdlInmueble.vchDomCalle,
        vchDomNumero: mdlInmueble.vchDomNumero,
        vchDomColonia: mdlInmueble.vchDomColonia,
        vchDomLocalidad: mdlInmueble.vchDomLocalidad,
        vchDomAlcaMun: mdlInmueble.vchDomAlcaMun,
        vchCodigoPostal: mdlInmueble.vchCodigoPostal,
        numValorVenta: this.decP.transform(mdlInmueble.numValorVenta, this.formatDec),
        intEstatusId: mdlInmueble.intEstatusId
      });
    }
  }

  // Guarda informacion
  guardaInmueble() {
    // Valida
    if (!this.validaTxt('Nombre del inmueble', this.formInmueble.get('vchInmueble').value, false, 120)) { return; }
    if (!this.validaTxt('Calle', this.formInmueble.get('vchDomCalle').value, false, 80)) { return; }
    if (!this.validaTxt('Número', this.formInmueble.get('vchDomNumero').value, false, 80)) { return; }
    if (!this.validaTxt('Código postal', this.formInmueble.get('vchCodigoPostal').value, false, 5)) { return; }


    if (this.formInmueble.get('numValorVenta').value === '' || this.formInmueble.get('numValorVenta').value === '0') {
      alert('El campo VALOR DE VENTA es obligatorio');
      return;
    }

    // Inicializa modelo
    const mdlInmueble: IInmueble = Object.assign({},
      { id: this.intInmuebleId },
      { vchInmueble: this.formInmueble.get('vchInmueble').value },
      { vchDomCalle: this.formInmueble.get('vchDomCalle').value },
      { vchDomNumero: this.formInmueble.get('vchDomNumero').value },
      { vchDomColonia: this.formInmueble.get('vchDomColonia').value },
      { vchDomLocalidad: this.formInmueble.get('vchDomLocalidad').value },
      { vchDomAlcaMun: this.formInmueble.get('vchDomAlcaMun').value },
      { vchCodigoPostal: this.formInmueble.get('vchCodigoPostal').value },
      { numValorVenta: this.quitaComas(this.formInmueble.get('numValorVenta').value) },
      { intEstatusId: this.regEdita ? this.formInmueble.get('intEstatusId').value : EST_INMUEBLE.DISPON }
    );

    // Segun modo conecta servicio
    if (this.regEdita) {
        // Actualiza
        this.inmueblesService.updateInmueble(mdlInmueble)
          .subscribe(inmResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
    } else {
        // Nuevo
        this.inmueblesService.createInmueble(mdlInmueble)
          .subscribe(inmResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
    }
  }

  successGuardado(edita: boolean) {
    if (edita) {
      alert('Inmueble modificado');
    } else {
      alert('Inmueble registrado');
    }

    this.navega('inmuebles');
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

  // Formatea número
  changeFormatDec(obj: any, numDec: number = 2) {
    let formControl: FormControl;
    formControl = obj;
    let valor: string = formControl.value;
    console.log(valor);

    valor = valor.replace('$', '');
    valor = String(this.quitaComas(valor));
    if (!this.isNumber(valor)) {
      if (numDec === 2) {
        valor = '0.00';
      } else {
        valor = '0.000000';
      }
    }
    if (numDec === 2) {
      formControl.patchValue(this.decP.transform(valor, this.formatDec));
    } else {
      formControl.patchValue(this.decP.transform(valor, this.formatDecSeis));
    }
  }

  quitaComas(strValor: string): number {
    let numValor = 0;

    strValor = strValor.replace('$', '');

    if (strValor.trim() !== '') {
      numValor = Number(strValor.split(',').join(''));
    }

    return numValor;
  }

  isNumber(value?: string | number): boolean {
     return ((value != null) &&
             (value !== '') &&
             !isNaN(Number(value.toString())));
  }

  /**********************************************************
    NAVEGACION
  **********************************************************/
  navega(pagina: string) {
    const irPagina: string = pagina;
    this.router.navigate([irPagina]);
  }
}
