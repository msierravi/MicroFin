import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LStorageService {

  constructor() { }

  // **************************************
  // LOGIN
  // **************************************
  setLogin(login: boolean) {
    sessionStorage.setItem('login', login ? '1' : '0');
  }

  getLogin(): boolean {
    let resultBoolean: boolean;

    resultBoolean = sessionStorage.getItem('login') === '1' ? true : false;

    return resultBoolean;
  }

  removeLogin() {
    sessionStorage.removeItem('login');
  }

  // **************************************
  // USUARIO
  // **************************************
  setUsuNombre(usuario: string) {
    sessionStorage.setItem('usuNom', usuario);
  }

  getUsuNombre(): string {
    return sessionStorage.getItem('usuNom');
  }

  removeUsuNombre() {
    sessionStorage.removeItem('usuNom');
  }
}
