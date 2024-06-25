import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/components/utils/Validations/CustomValidators';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css'],
})
export class SingUpComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerFormBuild();
  }

  registerFormBuild() {
    this.registerForm = this.fb.group({
      username: ['', [CustomValidators.required, CustomValidators.emailValidator()]],
      password: ['', [
        CustomValidators.required,
        CustomValidators.minLength(8),
        CustomValidators.lowercase,
        CustomValidators.uppercase,
        CustomValidators.numeric
      ]],
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
          this.router.navigate(['/login']);
          this.messageService.add({ severity: 'info', summary: 'Registro exitoso', detail: 'Usuario registrado correctamente', life: 3000 });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al registrarte, intentalo mas tarde' });
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
