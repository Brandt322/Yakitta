import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { BrandRequest, BrandResponse } from '../../models/interfaces/brand.interface';
import { BrandService } from 'src/app/services/brand/brand.service';

@Injectable({
  providedIn: 'root'
})
export class BrandStateService {

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

  updateBrand(id: number, brandRequest: BrandRequest): Observable<BrandResponse> {
    return this.brandtService.updateBrand(id, brandRequest).pipe(
      tap((updatedBrand: BrandResponse) => {
        const currentBrands = this.brandsSubject.getValue();
        const brandIndex = currentBrands.findIndex(brand => brand.id === id);
        if (brandIndex !== -1) {
          const updatedBrands = [...currentBrands];
          updatedBrands[brandIndex] = updatedBrand;
          this.brandsSubject.next(updatedBrands);
        }
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  deleteBrand(id: number): Observable<String> {
    return this.brandtService.deleteBrand(id).pipe(
      tap(() => {
        const currentBrands = this.brandsSubject.getValue();
        const updatedBrands = currentBrands.filter(brand => brand.id !== id);
        this.brandsSubject.next(updatedBrands);
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }
}
