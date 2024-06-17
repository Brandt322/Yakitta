import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { MainComponent } from './shared/components/layout/main/main.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { FacturasListComponent } from './features/facturas/facturas-list/facturas-list.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth-guard.guard';
import { SingUpComponent } from './auth/components/sing-up/sing-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SingUpComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard], children: [
      { path: '', pathMatch: 'full', component: ProductListComponent },
      { path: 'facturas', component: FacturasListComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
