import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { BrandService } from 'src/app/services/brand/brand.service';
import { BrandStateServiceService } from 'src/app/shared/components/services/brand-state-service.service';
import { ProductStateServiceService } from 'src/app/shared/components/services/product-state-service.service';
import { CustomValidators } from 'src/app/shared/components/utils/Validations/CustomValidators';
import { BrandResponse } from 'src/app/shared/models/interfaces/brand.interface';
import { ProductResponse } from 'src/app/shared/models/interfaces/product.interface';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: ProductResponse[] = [];
  brands: BrandResponse[] = [];
  productForm!: FormGroup;
  brandForm!: FormGroup;
  edditProductForm!: FormGroup;
  imageFile?: File;
  selectedView: string = localStorage.getItem('selectedView') || 'products';
  showModal = false;


  constructor(
    private productStateService: ProductStateServiceService,
    private brandtStateService: BrandStateServiceService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private brandService: BrandService,
    private ProductService: ProductService
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.myform();
    this.createBrand();
    this.getBrandsState();
    this.productFormInitial();
    this.selectedView = localStorage.getItem('selectedView') || 'products';
  }

  selectView(view: string) {
    this.selectedView = view;
    localStorage.setItem('selectedView', view);
  }

  getProducts() {
    this.productStateService.loadProducts();
    this.productStateService.products$
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastr.error(`Error al cargar los productos: ${error.name} ${error.statusText}`, 'Error');
          return throwError(() => error);
        }
        )
      ).subscribe((products: ProductResponse[]) => {
        this.products = products;
      });
  }

  getBrands() {
    this.brandService.getBrands()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastr.error(`Error al cargar las marcas: ${error.name} ${error.statusText}`, 'Error');
          return throwError(() => error);
        })
      ).subscribe((brands: BrandResponse[]) => {
        this.brands = brands;
      })
  }

  myform() {
    this.productForm = this.formBuilder.group({
      name: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      description: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      stock: ['', [CustomValidators.required, CustomValidators.numericType()]],
      price: ['', [CustomValidators.required, CustomValidators.numericDecimalType()]],
      discount: ['', [CustomValidators.numericDecimalType()]],
      product_type: ['', [CustomValidators.required]],
      image: ['', [CustomValidators.required, CustomValidators.fileSizeValidator(5 * 1024 * 1024)]],
      id_brands: ['', [CustomValidators.required]]
    });
  }

  getBrandsState() {
    this.brandtStateService.loadBrands();
    this.brandtStateService.brands$
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastr.error(`Error al cargar las marcas: ${error.name} ${error.statusText}`, 'Error');
          return throwError(() => error);
        })
      ).subscribe((brands: BrandResponse[]) => {
        this.brands = brands;
      });
  }

  createBrand() {
    this.brandForm = this.formBuilder.group({
      brandName: ['', [CustomValidators.required, CustomValidators.minLength(3)]]
    });
  }


  deleteProduct(id: number) {
    this.productStateService.deleteProduct(id).subscribe(
      () => {
        this.toastr.success('Producto eliminado correctamente', 'Éxito');
      },
      (error) => {
        this.toastr.error('Error al eliminar el producto', 'Error');
      }
    );
  }

  onImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.productForm.valid && this.imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      reader.onload = () => {
        let base64Image = reader.result as string;
        base64Image = base64Image.split(',')[1];
        const formValues = this.productForm.value;
        formValues.image = base64Image;
        formValues.id_brands = { id: formValues.id_brands };
        this.productStateService.createProduct(formValues).subscribe(
          (response) => {
            this.toastr.success('Producto creado correctamente', 'Éxito');
            this.productForm.reset();
            const brandControl = this.productForm.get('id_brands');
            if (brandControl) {
              brandControl.setValue('');
            }
            this.imageFile = undefined;
          },
          (error) => {
            this.toastr.error('Error al crear el producto', 'Error');
          }
        );
      };
      reader.onerror = (error) => {
        this.toastr.error('Error al convertir la imagen', 'Error');
      };
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  OnSubmitBrand() {
    if (this.brandForm.valid) {
      this.brandtStateService.createProduct(this.brandForm.value).subscribe(
        (response) => {
          this.toastr.success('Marca creada correctamente', 'Éxito');
          this.brandForm.reset();
        },
        (error) => {
          this.toastr.error('Error al crear la marca', 'Error');
        }
      );
    } else {
      this.brandForm.markAllAsTouched();
    }
  }

  productFormInitial() {
    this.edditProductForm = this.formBuilder.group({
      name: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      description: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      stock: ['', [CustomValidators.required, CustomValidators.numericType()]],
      price: ['', [CustomValidators.required, CustomValidators.numericDecimalType()]],
      discount: ['', [CustomValidators.numericDecimalType()]],
      product_type: ['', [CustomValidators.required]],
      image: ['', [CustomValidators.required, CustomValidators.fileSizeValidator(5 * 1024 * 1024)]],
      id_brands: ['', [CustomValidators.required]]
    });
  }

  onUpdateProduct() {
    if (this.edditProductForm.valid && this.imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      reader.onload = () => {
        let base64Image = reader.result as string;
        base64Image = base64Image.split(',')[1];
        const formValues = this.edditProductForm.value;
        formValues.image = base64Image;
        formValues.id_brands = { id: formValues.id_brands };
        this.productStateService.updateProduct(formValues.id, formValues).subscribe(
          (response) => {
            this.toastr.success('Producto actualizado correctamente', 'Éxito');
            this.edditProductForm.reset();
            const brandControl = this.edditProductForm.get('id_brands');
            if (brandControl) {
              brandControl.setValue('');
            }
            this.imageFile = undefined;
          },
          (error) => {
            this.toastr.error('Error al actualizar el producto', 'Error');
          }
        );
      };
      reader.onerror = (error) => {
        this.toastr.error('Error al convertir la imagen', 'Error');
      };
    } else {
      this.edditProductForm.markAllAsTouched();
    }
  }

  currentImage: string = '';

  openModal(productId: number) {
    this.showModal = !this.showModal;

    // Fetch the product data using productId
    this.ProductService.getProductById(productId).subscribe((product) => {
      // Update the form with the product data
      this.edditProductForm.patchValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price,
        discount: product.discount,
        product_type: product.product_type,
        id_brands: Number(product.id_brands)
      });
      this.currentImage = product.image;
    });
  }

  closeModal() {
    this.showModal = !this.showModal;
  }
}
