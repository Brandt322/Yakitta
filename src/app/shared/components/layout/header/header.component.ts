import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  showMenu = false;
  dropdownPopoverShow = false;

  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef;
  @ViewChild('popoverDropdownRef', { static: false }) popoverDropdownRef!: ElementRef;

  ngAfterViewInit(): void {
    createPopper(this.btnDropdownRef.nativeElement, this.popoverDropdownRef.nativeElement, {
      placement: 'bottom'
    });
  }


  toggleTooltip() {
    // Aquí puedes definir lo que quieres que suceda cuando se dispare el evento
    // Por ejemplo, puedes cambiar el valor de dropdownPopoverShow
    this.dropdownPopoverShow = !this.dropdownPopoverShow;
  }

  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }

}
