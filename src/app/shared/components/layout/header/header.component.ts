import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  showMenu = false;
  dropdownPopoverShow = false;
  cartDropdownShow = false;
  private clickOutsideListener: any;

  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef;
  @ViewChild('btnCartDropdownRef', { static: false }) btnCartDropdownRef!: ElementRef;

  @ViewChild('popoverDropdownRef', { static: false }) popoverDropdownRef!: ElementRef;
  @ViewChild('cartDropdownRef', { static: false }) cartDropdownRef!: ElementRef;

  constructor(private eRef: ElementRef) { }

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

}
