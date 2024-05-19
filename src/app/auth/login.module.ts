import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';


@NgModule({
  declarations: [LoginComponent, SingUpComponent],
  imports: [
    CommonModule
  ],
  exports: [LoginComponent, SingUpComponent]
})
export class LoginModule { }
