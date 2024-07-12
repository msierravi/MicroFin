import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CreditosComponent } from './creditos/creditos.component';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { ClienteDetComponent } from './clientes/cliente-det.component';
import { InmuebleDetComponent } from './inmuebles/inmueble-det.component';
import { CotizacionDetComponent } from './cotizaciones/cotizacion-det.component';
import { CatGeneralComponent } from './cata/cat-general/cat-general.component';
import { CatGeneralDetComponent } from './cata/cat-general/cat-general-det/cat-general-det.component';
import { LoginComponent } from './segu/login/login.component';
import { UsuariosComponent } from './segu/usuarios/usuarios.component';

const routes: Routes = [
    // Home
    { path: '', component: HomeComponent, pathMatch: 'full', redirectTo: '' },

    { path: 'login', component: LoginComponent },
    { path: 'usuarios', component: UsuariosComponent },

    { path: 'clientes', component: ClientesComponent },
    { path: 'cliente-det', component: ClienteDetComponent },

    { path: 'inmuebles', component: InmueblesComponent },
    { path: 'inmueble-det', component: InmuebleDetComponent },

    { path: 'cotizaciones', component: CotizacionesComponent },
    { path: 'cotizacion-det', component: CotizacionDetComponent },

    { path: 'creditos', component: CreditosComponent },
    { path: 'cobranza', component: CobranzaComponent },

    { path: 'cat-general/:cat', component: CatGeneralComponent },
    { path: 'cat-general-alta/:cat', component: CatGeneralDetComponent },
    { path: 'cat-general-edita/:cat', component: CatGeneralDetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
