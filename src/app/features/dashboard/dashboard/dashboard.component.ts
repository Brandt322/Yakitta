import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductStateServiceService } from 'src/app/shared/components/services/product-state-service.service';
import { CustomValidators } from 'src/app/shared/components/utils/Validations/CustomValidators';
import { ProductResponse } from 'src/app/shared/models/interfaces/product.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: ProductResponse[] = [];
  productForm!: FormGroup;
  imageFile?: File;

  constructor(
    private productStateService: ProductStateServiceService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.myform();
  }

  getProducts() {
    this.productStateService.loadProducts();
    this.productStateService.products$
      .pipe(
        catchError((error) => {
          this.toastr.error('Error al cargar los productos', 'Error');
          return throwError(() => error);
        }
        )
      ).subscribe((products: ProductResponse[]) => {
        this.products = products;
      });
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

}
