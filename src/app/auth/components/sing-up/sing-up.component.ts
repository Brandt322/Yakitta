import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/components/utils/Validations/CustomValidators';
import { RegisterService } from '../../services/register.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerFormBuild();
  }

  registerFormBuild() {
    this.registerForm = this.fb.group({
      username: ['', [CustomValidators.required, CustomValidators.emailValidator()]],
      password: ['', [CustomValidators.required, CustomValidators.minLength(1)]],
      firstname: ['', [CustomValidators.required, CustomValidators.minLength(2), CustomValidators.stringType()]],
      lastname: ['', [CustomValidators.required, CustomValidators.minLength(2), CustomValidators.stringType()]],
      city: ['', [CustomValidators.required, CustomValidators.minLength(2), CustomValidators.stringType()]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, password, firstname, lastname, city } = this.registerForm.value;
      this.registerService.register({ username, password, firstname, lastname, city }).subscribe(
        () => {
          this.toastr.success('Registro exitoso', 'Usuario registrado correctamente');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastr.error('Hubo un error al registrarte, intentalo mas tarde', 'Error');
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
