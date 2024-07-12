import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';

// Servicios
import { CotizacionesService } from './cotizaciones.service';
import { InmueblesService } from '../inmuebles/inmuebles.service';
import { ClientesService } from '../clientes/clientes.service';

// Interfaz
import { ICredito, IAmortizaciones } from '../creditos/ICredito';
import { IInmuebleCat } from '../inmuebles/IInmueble';
import { IClienteProspectoCat } from '../clientes/ICliente';

@Component({
  selector: 'app-cotizacion-det',
  templateUrl: './cotizacion-det.component.html',
  styleUrls: ['./cotizacion-det.component.css']
})
export class CotizacionDetComponent implements OnInit {

  // Edicion
  regEdita = false;
  modoEdicion: string;

  // Interfaz
  mdlInmueblesCat: IInmuebleCat[];
  mdlTablaAmortiza: IAmortizaciones[];
  mdlClientesCat: IClienteProspectoCat[];

  // Filtro
  filInmuebleId: 0;
  filClienteId: 0;

  // Formulario
  formCotiza = new FormGroup({
    id: new FormControl(0),
    intInmuebleId: new FormControl(0),
    numMontoVenta: new FormControl(0),
    numPorcEnganche: new FormControl(0),
    numMontoEnganche: new FormControl(0),
    intPlazo: new FormControl(0),
    numTasaInteres: new FormControl(0)
  });

  formCotizaCredito = new FormGroup({
    numCredito: new FormControl(0),
    numMensualidad: new FormControl(0)
  });

  // Formalizar
  activaFormaliza = false;

  // Activa/1desactiva controles
  desactivaControl: string;
  disBtnCalcular: string;
  disBtnGuardar: string;
  disBtnFormal: string;
  disBtnLimpiar: string;

  // Formato
  dp = new DatePipe('es-MX');
  decP = new DecimalPipe('es-MX');
  // tslint:disable-next-line:quotemark
  formatFec = "yyyy-MM-dd'T'HH:mm:ss";
  formatDec = '1.2-2';
  formatDecSeis = '1.6';

  // ID credito de tipo cotizacion
  // tslint:disable-next-line:variable-name
  intCreditoId_Cotiza = 0;

  // tslint:disable-next-line:max-line-length
  constructor(private cotizacionesService: CotizacionesService, private inmueblesService: InmueblesService,
              private clientesService: ClientesService, private router: Router) { }

  ngOnInit() {
    // Obtiene datos
    this.intCreditoId_Cotiza = this.cotizacionesService.vsintCreditoId_Cotiza;
    this.regEdita = this.cotizacionesService.vsModoEdicion;

    // Determina modo de edicion
    this.modoEdicion = this.regEdita ? 'Consulta' : 'Nueva';

    // Obtiene catalogo
    this.dameInmuebles();

    if (this.regEdita) {
      this.dameCotizacion();
    } else {
      // Inicializa formulario
      this.iniForm();
    }
  }


  /**********************************************************
    CATALOGOS
  **********************************************************/
    dameInmuebles() {
      // Inicializa modelo
      this.mdlInmueblesCat = null;

      // Conecta servicio
      this.inmueblesService.getInmuebleCat()
      .subscribe(cotResult => {
        // console.log('cotResult', cotResult);

        this.successDameInmuebles(cotResult.inmuebleResponse.inmueble);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameInmuebles(mdlInmueblesCat: IInmuebleCat[]) {
      // Si existen registros, llena modelo
      if (mdlInmueblesCat.length > 0) {
        this.mdlInmueblesCat = mdlInmueblesCat;
      }
    }

    dameClientes() {
      // Inicializa modelo
      this.mdlClientesCat = null;

      // Conecta servicio
      this.clientesService.getClienteCat(true)
      .subscribe(cliResult => {
        console.log('cliResult', cliResult);

        this.successDameClientes(cliResult.clienteResponse.cliente);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameClientes(mdlClientesCat: IClienteProspectoCat[]) {
      // Si existen registros, llena modelo
      if (mdlClientesCat.length > 0) {
        this.mdlClientesCat = mdlClientesCat;
      }
    }

    // Obtiene el valor de venta
    dameValorVenta() {
        // Asiga valor
        if (this.filInmuebleId > 0) {
        const valor = this.mdlInmueblesCat.find(i => i.id === this.filInmuebleId).numValorVenta;

        this.formCotiza.patchValue({ numMontoVenta: this.decP.transform(valor, this.formatDec) });
      } else {
        this.formCotiza.patchValue({ numMontoVenta: 0.00 });
      }
    }

  /**********************************************************
    FORMULARIO
  **********************************************************/
  // Inicializa
  iniForm() {
    // Inicializa modelo
    this.mdlTablaAmortiza = null;

    // Inicializa formularios
    this.formCotiza.patchValue({
      id: 0,
      intInmuebleId: 0,
      numMontoVenta: '0.00',
      numPorcEnganche: '0.00',
      numMontoEnganche: '0.00',
      intPlazo: 0,
      numTasaInteres: '0.000000'
    });

    this.filInmuebleId = 0;

    this.formCotizaCredito.patchValue({
      numCredito: '0.00',
      numMensualidad: '0.00'
    });

    // Desactiva/Activa controles
    this.desactivaControl = null;
    this.disBtnCalcular = null;
    this.disBtnGuardar = 'true';
    this.disBtnFormal = 'true';
    this.disBtnLimpiar = 'true';
  }

  // Obtiene datos
  dameCotizacion() {
    // Conecta servicio
    this.cotizacionesService.getCotizacion(this.intCreditoId_Cotiza)
    .subscribe(cotResult => {
      // console.log('cotResult', cotResult);

      this.successDameCotizacion(cotResult.creditoResponse.creditoUno);
    },
    error => {
          console.log('error', error);
    });
  }

  successDameCotizacion(mdlCredito: ICredito) {
    if (mdlCredito) {
      this.formCotiza.patchValue({
        id: mdlCredito.id,
        intInmuebleId: mdlCredito.intInmuebleId,
        numMontoVenta: this.decP.transform(mdlCredito.numMontoVenta, this.formatDec),
        numPorcEnganche: this.decP.transform(mdlCredito.numPorcEnganche, this.formatDec),
        numMontoEnganche: this.decP.transform(mdlCredito.numMontoEnganche, this.formatDec),
        intPlazo: mdlCredito.intPlazo,
        numTasaInteres: this.decP.transform(mdlCredito.numTasaInteres, this.formatDecSeis)
      });

      this.formCotizaCredito.patchValue({
        numCredito: this.decP.transform(mdlCredito.numCredito, this.formatDec),
        numMensualidad: this.decP.transform(mdlCredito.numMensualidad, this.formatDec)
      });

      // Obtiene la tabla de amortizacion
      this.dameAmoritza();

      // Desactiva/Activa controles
      this.desactivaControl = 'true';
      this.disBtnCalcular = 'true';
      this.disBtnGuardar = 'true';
      this.disBtnFormal = null;
      this.disBtnLimpiar = 'true';
    }
  }

  // Dame tabla amortizacion
  dameAmoritza() {
    // Inicializa
    this.mdlTablaAmortiza = null;

    // Conecta servicio
    this.cotizacionesService.getTablaAmortiza(this.intCreditoId_Cotiza)
    .subscribe(amoResult => {
      console.log('amoResult', amoResult);

      this.successDameAmortiza(amoResult.amortizacionResponse.amortizacion);
    },
    error => {
          console.log('error', error);
    });
  }

  successDameAmortiza(mdlTablaAmortiza: IAmortizaciones[]) {
    if (mdlTablaAmortiza.length > 0) {
      this.mdlTablaAmortiza = mdlTablaAmortiza;
    }
  }

  /**********************************************************
    CALCULA COTIZACION
  **********************************************************/

  obtieneEnganche() {
    const montoVenta: number = this.quitaComas(this.formCotiza.get('numMontoVenta').value);
    const porcEnganche: number = this.quitaComas(this.formCotiza.get('numPorcEnganche').value);
    const montoEnganche: number = montoVenta * (porcEnganche / 100);

    // Monto enganche
    this.formCotiza.patchValue({ numMontoEnganche: this.decP.transform(montoEnganche , this.formatDec) });
  }

  // Calcula la cotización
  calculaCotiza() {
    // Inicializa modelo
    this.mdlTablaAmortiza = null;
    // Inicializa controles
    this.formCotizaCredito.patchValue(
      {
        numCredito: '0.00',
        numMensualidad: '0.00'
      }
    );

    // Obtiene datos
    const inmuebleId: number = this.formCotiza.get('intInmuebleId').value;
    const porcEnganche: number = this.quitaComas(this.formCotiza.get('numPorcEnganche').value);
    const plazo: number = this.quitaComas(String(this.formCotiza.get('intPlazo').value));
    const tasaInteres: number = this.quitaComas(this.formCotiza.get('numTasaInteres').value);

    // Valida valores
    if (inmuebleId === 0) { alert('Seleccione un inmueble'); return false; }
    if (porcEnganche <= 0 || porcEnganche > 100.00) { alert('Capture un porcentaje de enganche entre 1 y 100'); return false; }
    if (plazo <= 0 || plazo > 360) { alert('Capture un plazo entre 1 y 360 meses'); return false; }
    if (tasaInteres <= 0.000000 || tasaInteres > 200.00) {
      alert('Capture una tasa de interés entre 0.000000 y 200.000000 por ciento'); return false;
    }

    // Conecta servicio
    this.cotizacionesService.getTablaCotiza(inmuebleId, porcEnganche, plazo, tasaInteres)
      .subscribe(tablaCotResult => {
        // console.log('mdlTablaAmortiza', tablaCotResult.creditoResponse.credito);

        this.successCalculaCotiza(tablaCotResult.creditoResponse.credito);
      },
        error => {
        console.log('error', error);
        });
  }

  successCalculaCotiza(mdlTablaAmortiza: IAmortizaciones[]) {
      // Si existen registros, llena modelo
      if (mdlTablaAmortiza.length > 0) {
        this.mdlTablaAmortiza = mdlTablaAmortiza;

        // Actualiza controles
        this.formCotizaCredito.patchValue(
          {
            numCredito: this.decP.transform(this.mdlTablaAmortiza[0].numSaldoInsoluto, this.formatDec),
            numMensualidad: this.decP.transform(this.mdlTablaAmortiza[0].numMensualidad, this.formatDec)
          }
        );

        // Activa/Desactiva botones
        this.disBtnCalcular = 'true';
        this.disBtnGuardar = null;
        this.disBtnFormal = null;
        this.disBtnLimpiar = null;
      }
  }

  // Guarda
  guardaCotizacion() {
    // Prospecto
    const clienteId = 0;
    const numeroCredito = '';

    // Inicializa modelo
    const mdlCredito: ICredito = Object.assign({},
      { id: this.intCreditoId_Cotiza },
      { intClienteId: clienteId },
      { intInmuebleId: this.formCotiza.get('intInmuebleId').value },
      { vchNumeroCredito: numeroCredito },
      { intEstatusId: 0 },
      { numMontoVenta: this.quitaComas(this.formCotiza.get('numMontoVenta').value) },
      { numPorcEnganche: this.quitaComas(this.formCotiza.get('numPorcEnganche').value) },
      { numMontoEnganche: this.quitaComas(this.formCotiza.get('numMontoEnganche').value) },
      { numCredito: this.quitaComas(this.formCotizaCredito.get('numCredito').value) },
      { intPlazo: this.formCotiza.get('intPlazo').value },
      { numTasaInteres: this.quitaComas(this.formCotiza.get('numTasaInteres').value) },
      { numPorcIVA: 16.00 },
      { numMensualidad: this.quitaComas(this.formCotizaCredito.get('numMensualidad').value) },
      { bitEsCotizacion: true },
      { datFecCotizacion: this.dp.transform(Date.now(), this.formatFec) },
      { bitEsCredito: false },
      { datFecCredito: this.dp.transform(Date.now(), this.formatFec) },
      { bitLiquidado: false },
      { datFecLiquidado: this.dp.transform(Date.now(), this.formatFec) }
    );

    // Segun modo conecta servicio
    if (this.regEdita) {
        // Actualiza
        this.cotizacionesService.updateCotizacion(mdlCredito)
          .subscribe(cotResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
    } else {
        // Nuevo
        this.cotizacionesService.createCotizacion(mdlCredito)
          .subscribe(cotResult => {
            this.successGuardado(this.regEdita);
          },
          error => {
                console.log('error', error);
          });
    }
  }

  successGuardado(edita: boolean) {
    if (edita) {
      alert('Cotización modificada');
    } else {
      alert('Cotización registrada');
    }

    this.navega('cotizaciones');
  }

  /**********************************************************
    FORMALIZA COTIZACION
  **********************************************************/
  formalizaCredito() {
    this.disBtnFormal = 'true';
    this.activaFormaliza = true;
    this.filClienteId = 0;

    // Llena catálogo
    this.dameClientes();
  }

  confirmaFormaliza() {
    if (this.filClienteId === 0) {
      alert('Seleccione un cliente');
      return;
    }

    this.cotizacionesService.updateFormalizaCred(this.intCreditoId_Cotiza, this.filClienteId)
    .subscribe(creResult => {
      this.successFormalizado(creResult);
    },
    error => {
          console.log('error', error);
    });
  }

  successFormalizado(result: any) {
    alert('Crédito formalizado');

    this.navega('cotizaciones');
  }

  /**********************************************************
    LIMPIA COTIZACION
  **********************************************************/
  limpiaCotizacion() {
    this.iniForm();
  }

  /**********************************************************
    FORMATO
  **********************************************************/

  // Formatea número
  changeFormatDec(obj: any, numDec: number = 2) {
    let formControl: FormControl;
    formControl = obj;
    let valor: string = formControl.value;

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
