import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces
import { ICatGeneralCons } from './ICatGeneral';
import { CAT_GENERAL } from '../../utilerias/constantes';

// Servicios
import { CatGeneralService } from './cat-general.service';

@Component({
  selector: 'app-cat-general',
  templateUrl: './cat-general.component.html',
  styleUrls: ['./cat-general.component.css']
})
export class CatGeneralComponent implements OnInit {

  // Identificación módulo
  moduloNombre = 'Catálogo';

  // Seguridad
  sesCveUsuario = 0;

  // Constantes
  MODOEDI_AGREGA = false;
  MODOEDI_EDITAR = true;

  // Mensajes HTML
  msjEliminaCatGeneral: string;

  // Interfaces
  mdlCatGeneral: ICatGeneralCons[];

  // ID
  mCatalogoId = 0;

  // Identificación del catálogo
  catalogo = {
    numero: 0,
    esFijo: false,
    nombre: '',
    conIdentity: false
  };

  // Formulario
  formGroup: FormGroup;

  // Carga de datos
  mCargaDatos = false;
  mSinRegistros = true;

  // Modal
  dplayElimina = 'none';

 constructor(private fb: FormBuilder, private catGeneralService: CatGeneralService,
             private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Obtiene parámetros de la URL
    this.activatedRoute.params
      .subscribe(params => {
        // tslint:disable-next-line:no-string-literal
        this.catalogo.numero = Number(params['cat']);

        // console.log("activatedRoute.params");

        // Limpia variables
        this.limpiaVariables();

        // Obtiene información del catálogo
        this.getIdentificaCatalogo(this.catalogo.numero);

        // Obtiene consulta
        this.cargarDatos(this.catalogo.numero, 0, 0);
      });

    // Si no tiene número de catálogo, regresa a login
    if (this.catalogo.numero === 0) {
      this.router.navigate(['/login']);
    }
  }

  // Limpia variables
  limpiaVariables() {
    this.mdlCatGeneral = null;
  }

  /**********************************************************
    CONSULTA
  **********************************************************/

  // Obtiene información
  cargarDatos(numeroCatalogo: number, catalogoId: number, usuarioId: number) {
    // Inicializa modelo
    this.mdlCatGeneral = null;
    // Inicializa variables de carga
    this.mCargaDatos = true;
    this.mSinRegistros = false;

    // console.log("conInstitucion");
    // console.log(conInstitucion);

    this.catGeneralService.getCatGenerales(numeroCatalogo, catalogoId, usuarioId)
      .subscribe(catGenResult => {
          // console.log('catGenResult', catGenResult);
          this.existenDatos(catGenResult.catGeneralResponse.catGeneral);
        },
        error => {
          this.mCargaDatos = false;
          this.mSinRegistros = true;
          // Muestra errores
          alert(error);
        });
  }

  existenDatos(mdlCatGeneral: ICatGeneralCons[]) {
    // Si existen registros, asigna datos
    if (mdlCatGeneral.length !== 0) {
      this.mdlCatGeneral = mdlCatGeneral;
      this.mSinRegistros = false;
    } else {
      this.mSinRegistros = true;
    }

    // Oculta barra de progreso
    this.mCargaDatos = false;
  }

  // Agrega registro
  nuevoRegistro() {
    // Envía datos al detalle del catálogo
    this.catGeneralService.viNumeroCatalogo = this.catalogo.numero;
    this.catGeneralService.viCatalogoId = 0;
    this.catGeneralService.viModoEdicion = this.MODOEDI_AGREGA;
    this.router.navigate(['/cat-general-alta/' + String(this.catalogo.numero)]);
  }

  // Edita registro
  editaRegistro(id: number) {
    // Envía datos al detalle del catálogo
    this.catGeneralService.viNumeroCatalogo = this.catalogo.numero;
    this.catGeneralService.viCatalogoId = id;
    this.catGeneralService.viModoEdicion = this.MODOEDI_EDITAR;

    this.router.navigate(['/cat-general-edita/' + String(this.catalogo.numero)]);
  }

  // Solicita confirmación para eliminar
  confirmaElimina(mdlCatGeneral: ICatGeneralCons) {
    // Asigna valor para eliminar
    this.mCatalogoId = mdlCatGeneral.id;
    this.msjEliminaCatGeneral = mdlCatGeneral.vchDescripcion;

    // Abre modal
    this.dplayElimina = 'block';
  }

  eliminaRegistro() {
    // Si ID <> CERO y VACIO, Elimina
    if (this.mCatalogoId != null && this.mCatalogoId !== 0) {
      // Elimina
      this.catGeneralService.deleteCatGeneral(this.catalogo.numero, this.mCatalogoId, 0)
        .subscribe(catGeneralResult => {
          this.cierraElimina();

          this.cargarDatos(this.catalogo.numero, 0, 0);
        },
          error => {
            // Muestra errores
            alert(error);
          });
    }
  }

  cierraElimina() {
    this.dplayElimina = 'none';
  }

  /**********************************************************
    IDENTIFICACIÓN DEL CATÁLOGO
  **********************************************************/
  getIdentificaCatalogo(numeroCatalogo: number) {
    // Obtiene datos del catálogo
    switch (numeroCatalogo) {
      case CAT_GENERAL.FORMA_PAGO:
        this.catalogo.esFijo = false;
        this.catalogo.nombre = 'Formas de pago';
        this.catalogo.conIdentity = true;

        break;
    }
  }
}
