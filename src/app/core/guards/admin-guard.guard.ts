import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userRoles = this.authService.getAuthorities();
    if (userRoles.includes('ROLE_ADMIN')) {
      return true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error de autorización', detail: 'No tienes permiso para acceder a esta página', life: 2500 });
      this.router.navigate(['/main']);
      return false;
    }
  }
}
