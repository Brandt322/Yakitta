import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/shared/models/interfaces/login.interface';
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';
  private AUTHORITIES_KEY = 'authorities';
  private roles: Array<string> = [];
  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) { }

  public login(loginRequest: LoginRequest): void {
    this.loginService.login(loginRequest).subscribe(({ token, bearer }) => {
      sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem('bearer', bearer);
      this.router.navigate(['/main']);
      this.messageService.add({ severity: 'success', summary: 'Bienvenido!', detail: 'Un gusto que vuelvas', life: 2500 });
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.messageService.add({ severity: 'info', summary: 'Hasta luego', detail: 'Vuelve pronto', life: 2500 });
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = sessionStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    // console.log(sessionStorage.getItem(this.tokenKey))
    return this.isLoggedIn() ? sessionStorage.getItem(this.tokenKey) : null;
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const sessionData = sessionStorage.getItem('user_data');
    if (sessionData) {
      const storedObject = JSON.parse(sessionData);
      const authorities = storedObject.authorities || [];
      authorities.forEach((authObject: { authority: string }) => {
        this.roles.push(authObject.authority);
      });
    }
    return this.roles;
  }
}
