export interface IResponse {
    catGeneralResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

export interface IFormaPago {
    id: number;
    vchFormaPago: string;
}
