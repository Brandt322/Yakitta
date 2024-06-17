import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { BrandRequest, BrandResponse } from '../../models/interfaces/brand.interface';
import { BrandService } from 'src/app/services/brand/brand.service';

@Injectable({
  providedIn: 'root'
})
export class BrandStateServiceService {

  private brandsSubject: BehaviorSubject<BrandResponse[]> = new BehaviorSubject<BrandResponse[]>([]);
  brands$: Observable<BrandResponse[]> = this.brandsSubject.asObservable();

  constructor(private brandtService: BrandService) { }

  loadBrands(): void {
    this.brandtService.getBrands().subscribe((brands: BrandResponse[]) => {
      this.brandsSubject.next(brands);
    });
  }

  createProduct(brand: BrandRequest): Observable<Object> {
    return this.brandtService.createBrand(brand).pipe(
      tap((newBrand: BrandResponse) => {
        const currentBrands = this.brandsSubject.getValue();
        this.brandsSubject.next([...currentBrands, newBrand]);
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }
}
