import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces
import { ICatGeneralCons } from '../ICatGeneral';
import { CAT_GENERAL } from '../../../utilerias/constantes';

// Servicios
import { CatGeneralService } from '../cat-general.service';

@Component({
  selector: 'app-cat-general-det',
  templateUrl: './cat-general-det.component.html',
  styleUrls: ['./cat-general-det.component.css']
})
export class CatGeneralDetComponent implements OnInit {

  // Identificación módulo
  moduloNombre = 'Catalogos general';

  // Variables de módulo
  mNumeroCatalogo = 0;
  mModoEdicion: boolean;

  // Edición formulario
  mCatalogoId: number;
  formGroup: FormGroup;

  // Variables elimina herramienta
  msj = '';
  idElimina = 0;

  // Identificación del catálogo
  catalogo = {
    nombre: '',
    conIdentity: false
  };

  // Modal
  display = 'none';

  constructor(private fb: FormBuilder, private catGeneralService: CatGeneralService,
              private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Obtiene variables
    this.mNumeroCatalogo = this.catGeneralService.viNumeroCatalogo;
    this.mModoEdicion = this.catGeneralService.viModoEdicion;
    this.mCatalogoId = this.catGeneralService.viCatalogoId;

    // Obtiene parámetros de la URL
    this.activatedRoute.params
      .subscribe(params => {
        // tslint:disable-next-line:no-string-literal
        const numeroCatalogo: number = Number(params['cat']);

        // Valida el número de catálogo
        if (numeroCatalogo !== this.mNumeroCatalogo) {
          alert('Acceso indebido al catálogo');
          this.router.navigate(['/']);
        }
      });

    // Obtiene datos de identificación
    this.getIdentificaCatalogo(this.mNumeroCatalogo);

    // Genera campos
    this.formGroup = this.fb.group({
      id: [0],
      vchDescripcion: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)]]
    });

    // Si modo edición, obtiene datos
    if (this.mModoEdicion) {
      this.limpiaVar();

      this.catGeneralService.getCatGenerales(this.mNumeroCatalogo, this.mCatalogoId, 0)
        .subscribe(catGeneralResult => {
            console.log('catGeneralResult', catGeneralResult);
            this.cargarFormulario(catGeneralResult.catGeneralResponse.catGeneral);
          },
          error => {
            // Muestra errores
            alert(error);
          });
    }
  }

  // Obtiene datos
  cargarFormulario(mdlCatGeneral: ICatGeneralCons[]) {
     console.log(mdlCatGeneral);

    // Edita
     if (this.mModoEdicion) {
      this.formGroup.patchValue({ id: mdlCatGeneral[0].id });
      this.formGroup.patchValue({ vchDescripcion: mdlCatGeneral[0].vchDescripcion });
    }
  }

  // Almacena información
  guardar() {
    // Desactiva botón
    const btn = document.getElementById('btnGuardar') as HTMLButtonElement;
    btn.disabled = true;

    const vchDescripcion = this.formGroup.get('vchDescripcion').value;

    // Si el modo edicion, actualiza, sino, crea
    if (this.mModoEdicion) {

      this.catGeneralService.updateCatGeneral(this.mNumeroCatalogo, this.mCatalogoId, vchDescripcion, 0)
        .subscribe(catGeneralResult => {
            // console.log('catGeneralResult', catGeneralResult);
            this.onSaveSuccess();
          },
          error => {
            // Muestra errores
            alert(error);
          });
    } else {
      this.catGeneralService.createCatGeneral(this.mNumeroCatalogo, vchDescripcion, this.catalogo.conIdentity, 0)
        .subscribe(catGeneralResult => {
             console.log('catGeneralResult', catGeneralResult);
            this.onSaveSuccess();
          },
          error => {
            // Muestra errores
            alert(error);
          });
    }
  }

  onSaveSuccess() {
    this.display = 'block';
  }
  cierraModal() {
    this.display = 'none';
  }

  limpiaVar() {
    this.formGroup.patchValue({ vchDescripcion: '' });
  }

  /**********************************************************
    IDENTIFICACIÓN DEL CATÁLOGO
  **********************************************************/
  getIdentificaCatalogo(numeroCatalogo: number) {
    // Obtiene datos del catálogo
    switch (numeroCatalogo) {
      case CAT_GENERAL.FORMA_PAGO:
        this.catalogo.nombre = 'Forma de pago';
        this.catalogo.conIdentity = true;
        break;
    }
  }

  /**********************************************************
    NAVEGA
  **********************************************************/
  navega() {
    // Cierra modal
    this.display = 'none';

    // console.log("det");

    this.router.navigate(['/cat-general/' + String(this.mNumeroCatalogo)]);
  }
}
