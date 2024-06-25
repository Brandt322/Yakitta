import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../global/loader/loader.service';
import { MessageService } from 'primeng/api';

interface ResponseBody {
  error?: string;
  errorMessage?: string;
}

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {

  constructor(private route: Router, private loader: LoaderService, private messageService: MessageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as ResponseBody;
        if (body && body.error === 'true' && body.errorMessage) {
          throw new Error(body.errorMessage);
        }
      }
    })).pipe(catchError((error: any) => {
      this.loader.hideLoader();
      console.log("Error con codigo: " + error.status + "\n Mensaje: " + error.message + "\n Error: " + error);

      if (error.status === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error servidor', detail: 'Error de conexión con el servidor Backend', life: 2000 });
      }

      if (error.status == 400) {
        let detail = error.error.message || error.error;
        let summary = 'Advertencia';
        if (detail === 'Los datos ingresados ya se encuentran registrados') {
          summary = 'Advertencia';
        } else if (detail === 'El nombre de usuario y/o la contraseña no son válidos') {
          summary = 'Error';
        }
        this.messageService.add({ severity: 'warn', summary: summary, detail: detail, life: 2000 });
      }

      if (error.status === 401) {
        let detail = error.error.message || 'No autorizado';
        this.messageService.add({ severity: 'warn', summary: 'Error de inicio de sesión', detail: detail, life: 2000 });
        if (detail !== 'No autorizado') {
          this.route.navigate(['/login']);
        }
      }

      if (error.status === 404) {
        let detail = error.error.message || 'No se encontraron registros';
        this.messageService.add({ severity: 'info', summary: 'Información', detail: detail, life: 2000 });
      }

      if (error.status === 500) {
        this.messageService.add({ severity: 'error', summary: 'Error 500', detail: 'Error, intentalo más tarde', life: 2000 });
      }
      return EMPTY;
    }));
  }
}
