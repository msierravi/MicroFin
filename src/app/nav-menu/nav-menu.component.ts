import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { LStorageService } from '../segu/l-storage.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  nombreUsuario = '';

  constructor(private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
  }

  // Verifica la sesión
  estaLogueado() {
    let logueado: boolean;
    this.nombreUsuario = this.lStorageService.getUsuNombre();
    logueado = this.lStorageService.getLogin();

    return logueado;
  }

  salir() {
    this.lStorageService.setLogin(false);
    this.lStorageService.setUsuNombre('');

    // Login
    this.router.navigate(['login']);
  }
}
