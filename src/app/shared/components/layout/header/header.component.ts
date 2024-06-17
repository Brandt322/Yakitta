import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createPopper } from '@popperjs/core';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { UserPrincipal } from 'src/app/shared/models/interfaces/login.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnInit {
  userDetails!: UserPrincipal;
  showMenu = false;
  dropdownPopoverShow = false;
  cartDropdownShow = false;
  private clickOutsideListener: any;

  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef;
  @ViewChild('btnCartDropdownRef', { static: false }) btnCartDropdownRef!: ElementRef;

  @ViewChild('popoverDropdownRef', { static: false }) popoverDropdownRef!: ElementRef;
  @ViewChild('cartDropdownRef', { static: false }) cartDropdownRef!: ElementRef;

  constructor(private eRef: ElementRef, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('user_data')) {
      const userData = sessionStorage.getItem('user_data') ? JSON.parse(sessionStorage.getItem('user_data') || '{}') : {};
      this.userDetails = userData.userPrincipal;
    }
  }

  ngAfterViewInit(): void {
    createPopper(this.btnDropdownRef.nativeElement, this.popoverDropdownRef.nativeElement, {
      placement: 'bottom'
    });
    createPopper(this.btnCartDropdownRef.nativeElement, this.cartDropdownRef.nativeElement, {
      placement: 'bottom'
    });
  }

  mouseLeaveButton(event: MouseEvent) {
    if (!this.popoverDropdownRef.nativeElement.contains(event.relatedTarget)) {
      this.dropdownPopoverShow = false;
    }
  }

  toggleTooltip() {
    this.dropdownPopoverShow = !this.dropdownPopoverShow;
  }

  toggleCartDropdown() {
    this.cartDropdownShow = !this.cartDropdownShow;
  }

  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.cartDropdownShow = false;
    }
  }

  onButtonClickProducts() {
    this.router.navigate(['/main']);
  }

  onButtonClickFacturas() {
    this.router.navigate(['/main/facturas']);
  }

  onButtonClickDashboard() {
    this.router.navigate(['/main/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}
