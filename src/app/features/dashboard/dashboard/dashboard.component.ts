import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  showModal = false;


  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Productos', icon: 'pi pi-fw pi-cog', routerLink: ['/main/dashboard/products'] },
      { label: 'Marcas', icon: 'pi pi-fw pi-cog', routerLink: ['/main/dashboard/brands'] }
    ];
    this.activeItem = this.items[0];
    this.navigateToProducts();
  }

  navigateToProducts() {
    this.router.navigate(['/main/dashboard/products']);
  }
}
