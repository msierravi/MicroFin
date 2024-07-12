export interface IResponse {
    clienteResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

// -------------------------------------

export interface ICliente {
    id: number;
    vchNombre: string;
    vchApellidoPaterno: string;
    vchApellidoMaterno: string;
    vchDomicilio: string;
    bitEsCliente: boolean;
}

export interface IClienteProspectoCat {
    id: number;
    vchNombre: string;
    vchApellidoPaterno: string;
    vchApellidoMaterno: string;
    bitEsCliente: boolean;
}

