export interface IResponse {
    creditoResponse: any;
    metadata: IMetadata;
}

export interface IResponseAmort {
    amortizacionResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

// ------------------------------

export interface ICredito {
    id: number;
    intClienteId: number;
    intInmuebleId: number;
    vchNumeroCredito: string;
    intEstatusId: number;
    numMontoVenta: number;
    numPorcEnganche: number;
    numMontoEnganche: number;
    numCredito: number;
    intPlazo: number;
    numTasaInteres: number;
    numPorcIVA: number;
    numMensualidad: number;
    bitEsCotizacion: boolean;
    datFecCotizacion: Date;
    bitEsCredito: boolean;
    datFecCredito: Date;
    bitLiquidado: boolean;
    datFecLiquidado: Date;
}

export interface ICreditosQry {
    id: number;
    vchNumeroCredito: string;
    intClienteId: number;
    vchCliente: string;
    intInmuebleId: number;
    vchInmueble: string;
    numCredito: number;
    numSaldoActual: number;
    intNumeroPago: number;
    numMensualidad: number;
    intEstatusId: number;
    vchEstatus: string;
}

export interface ICreditosCat {
    id: number;
    vchNumeroCredito: string;
    bitEsCotizacion: boolean;
}

export interface ICotizacionesQry {
    id: number;
    intClienteId: number;
    vchCliente: string;
    intInmuebleId: number;
    vchInmueble: string;
    bitEsCotizacion: boolean;
    datFecCotizacion: Date;
    numMontoVenta: number;
    numPorcEnganche: number;
    numMontoEnganche: number;
    numCredito: number;
    intPlazo: number;
    numTasaInteres: number;
}

export interface IAmortizaciones {
    id: number;
    intCreditoId: number;
    intNumeroPago: number;
    numSaldoInsoluto: number;
    numCapital: number;
    numInteres: number;
    numMensualidad: number;
    numIVA: number;
    numMensualidadTotal: number;
    datFecLimPago: Date;
}

export interface IAmortizacionesQry {
    id: number;
    intCreditoId: number;
    intNumeroPago: number;
    numCredito: number;
    numSaldoInsoluto: number;
    numCapital: number;
    numInteres: number;
    numMensualidad: number;
    numIVA: number;
    numMensualidadTotal: number;
}

export interface IAmortizaCredQry {
    id: number;
    intCreditoId: number;
    intNumeroPago: number;
    numSaldoInsoluto: number;
    numCapital: number;
    numInteres: number;
    numMensualidad: number;
    numIVA: number;
    numMensualidadTotal: number;
    datFecLimPago: Date;
    intEstatusMensId: number;
    vchEstatus: string;
    bitCapitalCubierto: boolean;
    bitInteresCubierto: boolean;
    bitIVACubierto: boolean;
    bitAmortizaVigente: boolean;
    numMontoPago: number;
    numSaldoMensTotal: number;
}

export interface ICreditosCobranzaQry {
    id: number;
    vchNumeroCredito: string;
    intClienteId: number;
    vchCliente: string;
    intInmuebleId: number;
    vchInmueble: string;
    intEstatusId: number;
    vchEstatus: string;
    numMensualidad: number;
    numCredito: number;
    numSaldo: number;
    vchReciboVigente: string;
    datFecLimPago: Date;
    numPagado: number;
    numPendiente: number;
    bitEsCotizacion: boolean;
}
