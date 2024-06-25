import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { MainComponent } from './components/layout/main/main.component';
import { AppRoutingModule } from '../app-routing.module';
import { PrimeNgModule } from './primeng/prime-ng.module';
import { ProductTabMenuComponent } from './components/layout/product-tab-menu/product-tab-menu.component';
import { BrandTabMenuComponent } from './components/layout/brand-tab-menu/brand-tab-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    ProductTabMenuComponent,
    BrandTabMenuComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    /* Layout */
    HeaderComponent,
    MainComponent,
    PrimeNgModule
  ]
})
export class SharedModule { }
