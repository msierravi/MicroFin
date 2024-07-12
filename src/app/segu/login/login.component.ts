import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Interfaz
import { IResponse, IUsuario, IMetadata } from '../IUsuario';

// Servicio
import { SeguridadService } from '../seguridad.service';
import { LStorageService } from '../l-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Manejo de errores
  errorMessage = '';
  errorExist = false;

  // Edición de formulario
  formGroup: FormGroup;

  // Habilitar controles
  dplaySpinner = 'none';

  constructor(private fb: FormBuilder, private seguridadService: SeguridadService, private lStorageService: LStorageService,
              private router: Router) { }

  ngOnInit() {
    // Genera campos
    this.formGroup = this.fb.group({
      id: '',
      email: ['', Validators.compose(
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(80),
        Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/)],
      )],
      password: ['', Validators.compose(
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12)]
      )]
    });
  }

  loguearse() {
    // Inicializa
    this.errorExist = false;
    this.errorMessage = '';

    // console.log('formGroup', this.formGroup);
    const email = this.formGroup.get('email').value;
    const pwd = this.formGroup.get('password').value;

    // Conecta servicio
    this.seguridadService.getLogin(email, pwd)
    .subscribe(usuResult => {
      // console.log('usuResult', usuResult);

      this.respLoguearse(usuResult, false);
    },
    error => {
      this.respLoguearse(error, true);
    });
  }

  respLoguearse(response: any, error: boolean) {
    // console.log('response', response);

    // Si respuesta correcta
    if (!error) {
      const mdlUsuario: IUsuario = response.usuarioResponse.usuarioUno;
      // console.log('mdlUsuario', mdlUsuario);

      // Almacena nombre de usuario
      this.lStorageService.setUsuNombre(mdlUsuario.vchUsuario);
      this.lStorageService.setLogin(true);

      // Home
      this.router.navigate(['']);

    } else {
      const resp: IMetadata = response.error.metadata[0];

      // console.log(resp);

      // Segun respuesta
      if (resp.code === '01' || resp.code === '-1') {
        this.errorExist = true;
        this.errorMessage = resp.msg;

        // Limpia controles
        setTimeout(() => {
          this.errorMessage = '';
          this.errorExist = false;
        }, 5000);
      }
    }
  }
}
