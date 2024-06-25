import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BRAND_API_ENDPOINTS } from 'src/app/core/global/constants/api-endpoints';
import { BrandRequest, BrandResponse } from 'src/app/shared/models/interfaces/brand.interface';
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private uri = environment.url

  constructor(private http: HttpClient) { }

  getBrands(): Observable<BrandResponse[]> {
    return this.http.get<BrandResponse[]>(`${this.uri}/${BRAND_API_ENDPOINTS.GET_ALL}`);
  }

  createBrand(brandRequest: BrandRequest): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(`${this.uri}/${BRAND_API_ENDPOINTS.CREATE}`, brandRequest);
  }

  updateBrand(id: number, brandRequest: BrandRequest): Observable<BrandResponse> {
    return this.http.put<BrandResponse>(`${this.uri}/${BRAND_API_ENDPOINTS.UPDATE}/${id}`, brandRequest);
  }

  deleteBrand(id: number): Observable<string> {
    return this.http.delete(`${this.uri}/${BRAND_API_ENDPOINTS.DELETE}/${id}`, { responseType: 'text' });
  }
}
