export interface IResponse {
    inmuebleResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

// -------------------------------------

export interface IInmueble {
    id: number;
    vchInmueble: string;
    vchDomCalle: string;
    vchDomNumero: string;
    vchDomColonia: string;
    vchDomLocalidad: string;
    vchDomAlcaMun: string;
    vchCodigoPostal: string;
    numValorVenta: number;
    intEstatusId: number;
}

export interface IInmuebleQry {
    id: number;
    vchInmueble: string;
    vchDomicilio: string;
    vchCodigoPostal: string;
    numValorVenta: number;
    intEstatusId: number;
    vchEstatusInm: string;
}

export interface IInmuebleCat {
    id: number;
    vchInmueble: string;
    numValorVenta: number;
    intEstatusId: number;
}
