import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Idioma
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import localeEsMX from '@angular/common/locales/es-MX';

registerLocaleData(localeES, 'es');
registerLocaleData(localeEsMX, 'es-MX');

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteDetComponent } from './clientes/cliente-det.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { InmuebleDetComponent } from './inmuebles/inmueble-det.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizacionDetComponent } from './cotizaciones/cotizacion-det.component';

import { CreditosComponent } from './creditos/creditos.component';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { PagosComponent } from './pagos/pagos.component';

// Catalogos
import { CatGeneralComponent } from './cata/cat-general/cat-general.component';
import { CatGeneralDetComponent } from './cata/cat-general/cat-general-det/cat-general-det.component';
import { UsuariosComponent } from './segu/usuarios/usuarios.component';
import { LoginComponent } from './segu/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ClientesComponent,
    ClienteDetComponent,
    InmueblesComponent,
    InmuebleDetComponent,
    CotizacionesComponent,
    CotizacionDetComponent,

    CreditosComponent,
    CobranzaComponent,
    PagosComponent,

    CatGeneralComponent,
    CatGeneralDetComponent,
    UsuariosComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
