import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { LStorageService } from '../segu/l-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private lStorageService: LStorageService, private router: Router) { }

  ngOnInit() {
    // Verifica sesion
    const logueado = this.lStorageService.getLogin();
    if (!logueado) {
      this.router.navigate(['login']);
    }
  }
}
