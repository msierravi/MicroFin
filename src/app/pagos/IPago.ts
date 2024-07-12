export interface IResponse {
    pagoResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

export interface ISaldoFavor {
    id: number;
    intCreditoId: number;
    intPagoOrigenId: number;
    numMontoFavor: number;
    intPagoDestinoId: number;
}

export interface IPagosQry {
    id: number;
    intCreditoId: number;
    intAmortizacionId: number;
    intNumeroPago: number;
    intFormaPagoId: number;
    vchFormaPago: string;
    numMontoPago: number;
    datFecPago: Date;
    datFecRegPago: string;
}
