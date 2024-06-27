import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_API_ENDPOINTS } from 'src/app/core/global/constants/api-endpoints';
import { UserPrincipal } from 'src/app/shared/models/interfaces/login.interface';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private uri = environment.url

  constructor(private http: HttpClient) { }

  getOrderByUser(userId: number): Observable<UserPrincipal> {
    return this.http.get<UserPrincipal>(`${this.uri}/${USER_API_ENDPOINTS.GET_BY_ID}/${userId}`);
  }
}
