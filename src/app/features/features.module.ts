import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product/product-list/product-list.component';
import { FacturasListComponent } from './facturas/facturas-list/facturas-list.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ProductListComponent,
    FacturasListComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ProductListComponent,
    FacturasListComponent,
    DashboardComponent
  ]
})
export class FeaturesModule { }
