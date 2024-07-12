import { Component, OnInit } from '@angular/core';

// Interfaz
import { ICreditosCat, ICreditosCobranzaQry } from '../creditos/ICredito';
import { IClienteProspectoCat } from '../clientes/ICliente';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.css']
})
export class CobranzaComponent implements OnInit {

  // Interfaz
  mdlCreditosCat: ICreditosCat[];
  mdlClienteCat: IClienteProspectoCat[];
  mdlCreditosCobranzaQry: ICreditosCobranzaQry[];

  // Totales
  totReg = 0;

  // Filtros
  filCreditoId = 0;
  filClienteId = 0;

  constructor() { }

  ngOnInit() {
    // Obtiene catalogos
    this.dameCreditosCat();
    this.dameClientes();

    // Obtiene consulta
    this.dameCobranza();
  }

  /**********************************************************
    CATALOGOS
  **********************************************************/
    dameCreditosCat() {
      // Inicializa modelo
      this.mdlCreditosCat = null;
    }

    successDameCreditosCat(mdlCreditosCat: any) {
      if (!mdlCreditosCat) {
        this.mdlCreditosCat = mdlCreditosCat;
      }
    }

    dameClientes() {
      // Inicializa modelo
      this.mdlClienteCat = null;
    }

    successDameClientes(mdlClienteCat: any) {
      if (!mdlClienteCat) {
        this.mdlClienteCat = mdlClienteCat;
      }
    }

  /**********************************************************
    CONSULTA
  **********************************************************/
    dameCobranza() {
      // Inicializa modelo
      this.mdlCreditosCobranzaQry = null;

      // Parametros de los filtros
    }

    successDameCobranza(mdlCreditosCobranzaQry: any) {
      if (!mdlCreditosCobranzaQry) {
        this.mdlCreditosCobranzaQry = mdlCreditosCobranzaQry;

        // Total registros
        this.totReg = this.mdlCreditosCobranzaQry.length;
      }
    }

  /**********************************************************
    HISTORIAL DE PAGOS
  **********************************************************/
  abreHistorial(creditoId: number) {

  }
}
