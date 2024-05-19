import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './components/layout/header/header.component';
import { MainComponent } from './components/layout/main/main.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    /* Layout */
    HeaderComponent,
    MainComponent,
  ]
})
export class SharedModule { }
