import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';

// Servicios
import { InmueblesService } from '../inmuebles/inmuebles.service';
import { ClientesService } from '../clientes/clientes.service';
import { CreditosService } from './creditos.service';
import { PagosService } from '../pagos/pagos.service';
import { CatalogosService } from '../cata/catalogos.service';
import { UpdownloadService } from '../utilerias/updownload.service';
import { LStorageService } from '../segu/l-storage.service';

// Interfaz
import { IClienteProspectoCat } from '../clientes/ICliente';
import { IInmuebleCat } from '../inmuebles/IInmueble';
import { ICreditosQry, IAmortizaCredQry } from './ICredito';
import { IRespSQL } from '../utilerias/IGeneral';
import { IFormaPago } from '../cata/IFormaPago';
import { EST_MENS, FORMA_PAGO } from '../utilerias/constantes';
import { IPagosQry, ISaldoFavor } from '../pagos/IPago';
import { ProgressStatus, ProgressStatusEnum} from '../utilerias/progress-status.model';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CreditosComponent implements OnInit {

  // Constantes
  MENS_PENDIE = EST_MENS.PENDIE;
  MENS_PAGADO = EST_MENS.PAGADO;
  MENS_INCOMP = EST_MENS.INCOMP;

  // Interfaz
  mdlClientesCat: IClienteProspectoCat[];
  mdlInmueblesCat: IInmuebleCat[];
  mdlCreditosQry: ICreditosQry[];
  mdlAmortizaCred: IAmortizaCredQry[];
  mdlCatFormaPago: IFormaPago[];
  mdlPagoInserta: IRespSQL;
  mdlSaldoFavor: ISaldoFavor[];
  mdlPagos: IPagosQry[];

  // Totales
  totReg = 0;

  // Filtros
  filClienteId = 0;
  filInmuebleId = 0;
  filFormaPagoId = 1;

  // Datos del registro
  strCliente = '';
  strInmueble = '';
  strNumeroAmortiza = '0';

  // ID
  intCreditoId = 0;
  intSaldoFavorId = 0;

  // Formulario
  formPago = new FormGroup({
    intFormaPagoId: new FormControl(0),
    numMontoPago: new FormControl(0),
    datFecPago: new FormControl('')
  });

  // Formato
  dp = new DatePipe('es-MX');
  decP = new DecimalPipe('es-MX');
  formatFec = 'yyyy-MM-dd';
  // formatFecSave = 'yyyy-MM-dd';
  formatDec = '1.2-2';

  // Modal
  dplayTablaAmort = 'none';
  dplayPago = 'none';
  dplayConsPago = 'none';

  // Deshabilitar
  desactivaControl: string;

  // Descarga archivo
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private inmueblesService: InmueblesService, private clientesService: ClientesService,
              private creditosService: CreditosService, private pagosService: PagosService,
              private catalogosService: CatalogosService, private updownloadService: UpdownloadService,
              private lStorageService: LStorageService, private router: Router) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
  }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    } else {
      // Activa control
      this.desactivaControl = null;

      // Obtiene catalogos
      this.dameClientes();
      this.dameInmuebles();

      // Obtiene consulta
      this.dameCreditos();
    }
  }

  /**********************************************************
    CATALOGOS
  **********************************************************/
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

    dameFormaPago() {
      // Inicializa modelo
      this.mdlCatFormaPago = null;
      this.filFormaPagoId = 1;

      // Conecta servicio
      this.catalogosService.getCatFormasPago()
      .subscribe(fpaResult => {
        console.log('fpaResult', fpaResult);

        this.successDameFormaPag(fpaResult.catGeneralResponse.catGeneral);
      },
      error => {
        console.log('error', error);
      });
    }

    successDameFormaPag(mdlCatFormaPago: IFormaPago[]) {
      // Si existen registros, llena modelo
      if (mdlCatFormaPago.length > 0) {
        this.mdlCatFormaPago = mdlCatFormaPago;
      }
    }

  /**********************************************************
    CONSULTA
  **********************************************************/
    dameCreditos() {
      // Inicializa modelo
      this.mdlCreditosQry = null;

      // Conecta servicio
      this.creditosService.getCreditos(this.filClienteId, this.filInmuebleId)
      .subscribe(creResult => {
        console.log('creResult', creResult);
        this.successDameCreditos(creResult.creditoResponse.credito);
      },
      error => {
            console.log('error', error);
      });
    }

    successDameCreditos(mdlCreditosQry: ICreditosQry[]) {
      if (mdlCreditosQry.length > 0) {
        this.mdlCreditosQry = mdlCreditosQry;

        // Total registros
        this.totReg = this.mdlCreditosQry.length;
      }
    }

  /**********************************************************
    TABLA DE AMORTIZACION
  **********************************************************/
    abreAmortiza(creditoId: number, clienteNom: string, inmuebleNom: string) {
      // Inicializa
      this.intCreditoId = 0;
      this.strCliente = '';
      this.strInmueble = '';

      // Obtiene tabla de amortización
      this.dameAmortiza(creditoId, clienteNom, inmuebleNom);

      // Abre modal
      this.dplayTablaAmort = 'block';
    }

    cierraAmortiza() {
      // Cierra modal
      this.dplayTablaAmort = 'none';
    }

    dameAmortiza(creditoId: number, clienteNom: string, inmuebleNom: string) {
      // Inicializa modelo
      this.mdlAmortizaCred = null;
      this.intCreditoId = creditoId;

      // Conecta servicio
      this.creditosService.getAmortizaCred(creditoId)
      .subscribe(creAmoResult => {
        console.log('creAmoResult', creAmoResult);
        this.successDameAmortiza(creAmoResult.amortizacionResponse.amortizacion, clienteNom, inmuebleNom);
      },
      error => {
            console.log('error', error);
      });
    }

    successDameAmortiza(mdlAmortizaCred: IAmortizaCredQry[], clienteNom: string, inmuebleNom: string) {
      if (mdlAmortizaCred.length > 0) {
        this.mdlAmortizaCred = mdlAmortizaCred;

        // Asigna
        this.strCliente = clienteNom;
        this.strInmueble = inmuebleNom;
      }
    }

  /**********************************************************
    PAGOS
  **********************************************************/
  abrePago() {
    this.cierraAmortiza();
    this.dplayPago = 'block';

    // Inicializa formulario de pago
    this.formPago.patchValue({
      intFormaPagoId: 1,
      numMontoPago: this.decP.transform('0.00', this.formatDec),
      datFecPago: this.dp.transform(Date.now(), this.formatFec)
    });

    // Llena formas de pago
    this.dameFormaPago();
  }

  cierraPago() {
    this.intCreditoId = 0;
    // Activa control
    this.desactivaControl = null;

    this.dplayPago = 'none';
  }

  aplicaPago() {
    // Obtiene datos
    const creditoId = this.intCreditoId;
    const formaPagoId: number = this.filFormaPagoId;
    const montoPago: number = this.quitaComas(this.formPago.get('numMontoPago').value);
    const fechaPago = this.formPago.get('datFecPago').value;
    const saldoFavorId = this.intSaldoFavorId;

    // Valida
    if (creditoId === 0) { alert('El sistema no identificó el crédito seleccionado, cierre la ventana y vuela a intentarlo'); return; }
    if (this.filFormaPagoId === null) { alert('Seleccione una forma de pago'); return; }
    if (montoPago <= 0.00) { alert('Capture un monto de pago válido'); return; }
    if (fechaPago === '') { alert('Capture la fecha de pago'); return; }

    this.pagosService.getInsertaPago(creditoId, formaPagoId, montoPago, fechaPago, saldoFavorId)
    .subscribe(pagResult => {
      console.log('pagResult', pagResult);
      this.successAplicaPago(pagResult.pagoResponse.pagoUno);
    },
    error => {
          console.log('error', error);
    });
  }

  successAplicaPago(mdlPagoInserta: IRespSQL) {
    if (mdlPagoInserta != null) {
      this.mdlPagoInserta = mdlPagoInserta;

      console.log('mdlPagoInserta', mdlPagoInserta);

      // Obtiene respuesta
      if (this.mdlPagoInserta.vchResultado !== 'OK') {
        alert('Ocurrió un posible error, revise si el pago quedó aplicado, sino reinténtelo.');
      } else {
        alert('Pago aplicado.');
      }

      this.cierraPago();
    }
  }

  /**********************************************************
    CONSULTA DE PAGOS
  **********************************************************/
    abreConsPagos(amortizaId: number) {
      this.dplayConsPago = 'block';

      // Llena formas de pago
      this.damePagos(amortizaId);
    }

    cierraConsPagos() {
      this.dplayConsPago = 'none';
    }

    damePagos(amortizaId: number) {
      // Inicializa modelo
      this.mdlPagos = null;
      this.strNumeroAmortiza = '0';

      // Conecta servicio
      this.pagosService.getPagos(amortizaId)
      .subscribe(pagResult => {
        console.log('pagResult', pagResult);
        this.successPagos(pagResult.pagoResponse.pago);
      },
      error => {
            console.log('error', error);
      });
    }

    successPagos(mdlPagos: IPagosQry[]) {
      if (mdlPagos.length > 0) {
        this.mdlPagos = mdlPagos;

        // Obtiene numero de amortización
        this.strNumeroAmortiza = String(this.mdlPagos[0].intNumeroPago);
      }
    }

  /**********************************************************
    SALDO A FAVOR
  **********************************************************/
  dameSaldoFavor() {
    // Si forma de pago no es saldo favor, termina
    if (this.filFormaPagoId !== FORMA_PAGO.SALDO_FAV) {
      // Activa control
      this.desactivaControl = null;
      this.formPago.patchValue({ numMontoPago: '0.00' });

      return;
    }

    // Inicializa modelo
    this.mdlSaldoFavor = null;
    this.intSaldoFavorId = 0;

    this.pagosService.getSaldoFavorNoAplica(this.intCreditoId)
    .subscribe(sfaResult => {
      console.log('sfaResult', sfaResult);
      this.successSaldoFavor(sfaResult.pagoResponse.pago);
    },
    error => {
          console.log('error', error);
    });
  }

  successSaldoFavor(mdlSaldoFavor: ISaldoFavor[]) {
    if (mdlSaldoFavor.length > 0) {
      this.mdlSaldoFavor = mdlSaldoFavor;

      // Obtiene datos
      this.intSaldoFavorId = this.mdlSaldoFavor[0].id;
      this.formPago.patchValue({ numMontoPago: this.decP.transform(this.mdlSaldoFavor[0].numMontoFavor, this.formatDec) });
      // Activa control
      this.desactivaControl = 'true';

    } else {
      this.filFormaPagoId = 1;
      alert('No existen saldos a favor pendientes de aplicar, elija otra forma de pago.');
    }
  }

  /**********************************************************
    FORMATO
  **********************************************************/

  // Formatea número
  changeFormatDec(obj: any) {
    let formControl: FormControl;
    formControl = obj;
    let valor: string = formControl.value;

    valor = valor.replace('$', '');
    valor = String(this.quitaComas(valor));
    if (!this.isNumber(valor)) {
      valor = '0.00';
    }

    formControl.patchValue(this.decP.transform(valor, this.formatDec));
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
    REPORTE
  **********************************************************/

  // Descarga de archivos
  public downloadFile(rptNum: number, creditoId: number) {
    // Status
    this.downloadStatus.emit({ status: ProgressStatusEnum.START });

    // Arma parámetros
/*
    const aParam = new HttpParams()
      .set('ses', String(this.sesCveUsuario))
      .set('plantilla', String(indicePlantilla))
      .set('tipoConsulta', String(tipoConsulta));
*/
    // Descarga archivo
    this.updownloadService.getReporte(rptNum, creditoId).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            // Status
            this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });

            // Barra de progreso
            // this.showProgress = true;
            // this.percentage = Math.round((data.loaded / data.total) * 100);

            break;
          case HttpEventType.Response:
            // Status
            this.downloadStatus.emit({ status: ProgressStatusEnum.COMPLETE });

            // Barra de progreso
            // this.showProgress = false;

            // Archivo
            let file = '';
            if (rptNum === 1) {
              file = 'Credito_' + String(creditoId) + '.pdf';
            } else {
              file = 'Pago_' + String(creditoId) + '.pdf';
            }

            const downloadedFile = new Blob([data.body], { type: data.body.type });

            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = file;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }

        // Limpia barra de progreso
        /*
        setTimeout(() => {
          this.percentage = 0;
        }, 1000);
        */
      },
      error => {
        this.downloadStatus.emit({ status: ProgressStatusEnum.ERROR });

        // Muestra errores
        alert('Error al descargar archivo.');
      }
    );
  }
}
