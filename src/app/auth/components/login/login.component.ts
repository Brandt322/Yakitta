import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomValidators } from 'src/app/shared/components/utils/Validations/CustomValidators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginFormBuild();
    sessionStorage.clear();
    localStorage.clear();
  }

  loginFormBuild() {
    this.loginForm = this.fb.group({
      username: ['', [CustomValidators.required, CustomValidators.emailValidator()]],
      password: ['', [
        CustomValidators.required,
        CustomValidators.minLength(8),
        CustomValidators.lowercase,
        CustomValidators.uppercase,
        CustomValidators.numeric
      ]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authenticationService.login({ username, password });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
