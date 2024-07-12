export interface IResponse {
  catGeneralResponse: any;
  metadata: IMetadata;
}

export interface IMetadata {
  code: string;
  msg: string;
  type: string;
}

export interface ICatGeneralCons {
  id: number;
  vchDescripcion: string;
}

