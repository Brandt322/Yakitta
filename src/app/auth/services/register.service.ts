import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { REGISTER_API_ENDPOINTS } from './../../core/global/constants/api-endpoints';
import { RegisterRequest } from "src/app/shared/models/interfaces/register.interface";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private uri = environment.url;

  constructor(private http: HttpClient) { }

  register(registerRequest: RegisterRequest): Observable<Object> {
    return this.http.post(`${this.uri}/${REGISTER_API_ENDPOINTS.REQUEST_MAPPING}/${REGISTER_API_ENDPOINTS.REGISTER}`, registerRequest).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

}
