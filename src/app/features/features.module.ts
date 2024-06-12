import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product/product-list/product-list.component';
import { FacturasListComponent } from './facturas/facturas-list/facturas-list.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';



@NgModule({
  declarations: [
    ProductListComponent,
    FacturasListComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductListComponent,
    FacturasListComponent,
    DashboardComponent
  ]
})
export class FeaturesModule { }
