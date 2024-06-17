import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, retry, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../global/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.dev';

interface ResponseBody {
  error?: string;
  errorMessage?: string;
}

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {

  constructor(private route: Router, private loader: LoaderService, private toast: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(retry(environment.REINTENTOS)).pipe(tap(event => {
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
        this.toast.error('Error de conexión con el servidor Backend', 'Error servidor', { timeOut: 2000 });
      }

      if (error.status == 400) {
        if (error.error.message === 'Los datos ingresados ya se encuentran registrados') {
          this.toast.warning(error.error.message, 'Advertencia', { timeOut: 2000 });
        } else if (error.error.message === 'El nombre de usuario y/o la contraseña no son válidos') {
          this.toast.error(`${error.error.message}`, 'Error', { timeOut: 2000 });
        } else if (error.error) {
          this.toast.error(`${error.error}`, 'Error 400', { timeOut: 2000 });
        }
        else {
          this.toast.error(`${error.error.message}`, 'Error 400', { timeOut: 2000 });
        }
      }

      if (error.status === 401) {
        if (error.error.message === 'No autorizado') {
          this.toast.warning(error.error.message, 'Error de inicio de sesión', { timeOut: 2000 });
        } else {
          this.toast.error(`${error.error.message}`, 'Error 401', { timeOut: 2000 });
          this.route.navigate(['/login']);
        }
      }

      // if (error.status === 401) {
      //   this.route.navigate(['/login']);
      // }

      if (error.status === 404) {
        if (error.error.message === 'No se encontraron registros') {
          this.toast.info(error.error.message, 'Información', { timeOut: 2000 });
        } else {
          this.toast.error(`${error.error.message}`, 'Error 404', { timeOut: 2000 });
        }
      }

      if (error.status === 500) {
        // if (error.error.message === 'No autorizado') {
        //   this.toast.error(error.error.message, 'Error de inicio de sesión', { timeOut: 2000 });
        // } else {
        //   this.toast.error(`${error.error.message}`, 'Error 500', { timeOut: 2000 });
        //   this.route.navigate(['/login']);
        // }
        this.toast.error('Error, intentalo más tarde', 'Error 500', { timeOut: 2000 });
      }
      return EMPTY;
    }));
  }
}
