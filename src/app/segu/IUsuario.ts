export interface IResponse {
    usuarioResponse: any;
    metadata: IMetadata;
}

export interface IMetadata {
    code: string;
    msg: string;
    type: string;
}

export interface IUsuario {
    id: number;
    vchUsuario: string;
    vchEmail: string;
    nvchPassword: string;
}
