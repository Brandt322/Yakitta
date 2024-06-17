import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap } from "rxjs";
import { LOGIN_API_ENDPOINTS } from "src/app/core/global/constants/api-endpoints";
import { LoginRequest, LoginResponse } from "src/app/shared/models/interfaces/login.interface";
import { environment } from "src/environments/environment.dev";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private uri = environment.url;
  private readonly userKey = 'user_data';

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // console.log('credenciales: ', credentials);
    return this.http.post<LoginResponse>(`${this.uri}/${LOGIN_API_ENDPOINTS.REQUEST_MAPPING}/${LOGIN_API_ENDPOINTS.LOGIN}`, loginRequest).pipe(
      tap((userPrincipal: LoginResponse) => {
        // console.log('userPrincipal: ', userPrincipal.userPrincipal.image);
        sessionStorage.setItem(this.userKey, JSON.stringify(userPrincipal));
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

}
