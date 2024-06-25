import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductStateServiceService } from '../../services/product-state-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { ProductResponse } from 'src/app/shared/models/interfaces/product.interface';
import { ConfirmationService, ConfirmEventType, Message, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from '../../utils/Validations/CustomValidators';
import { BrandService } from 'src/app/services/brand/brand.service';
import { BrandResponse } from 'src/app/shared/models/interfaces/brand.interface';

@Component({
  selector: 'app-product-tab-menu',
  templateUrl: './product-tab-menu.component.html',
  styleUrls: ['./product-tab-menu.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog-content::-webkit-scrollbar {
          width: 5px;
      }
      :host ::ng-deep .p-dialog-content::-webkit-scrollbar-track {
        background: #eee;
      }
      :host ::ng-deep .p-dialog-content::-webkit-scrollbar-thumb {
        background: var(--blue-400);
      }
      :host ::ng-deep .p-dialog-content::-webkit-scrollbar-thumb:hover {
        background: #88dd88;
      }
      :host ::ng-deep .p-image-preview {
        max-width: 50vw;
        max-height: 50vh;
      }
    `
  ],
  providers: [ConfirmationService]
})
export class ProductTabMenuComponent implements OnInit {
  currentProductId!: number;
  products: ProductResponse[] = [];
  brands: BrandResponse[] = [];
  productForm!: FormGroup;
  editProductForm!: FormGroup;
  visibleCreateModal: boolean = false;
  visibleEditModal: boolean = false;
  imageFile: File | undefined;
  messages!: Message[];
  @ViewChild('imageInput') imageInputElement!: ElementRef;

  // Para almacenar la vista previa de la imagen actual o nueva
  currentImagePreview: string = '';

  constructor(
    private productStateService: ProductStateServiceService,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getProductsState();
    this.getBrands();
    this.productInitForm();
    this.editProductInitForm();
    this.messages = [];
  }

  getProductsState() {
    this.productStateService.loadProducts();
    this.productStateService.products$
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al cargar los productos: ${error.name} ${error.statusText}` });
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al cargar las marcas: ${error.name} ${error.statusText}` });
          return throwError(() => error);
        })
      ).subscribe((brands: BrandResponse[]) => {
        this.brands = brands;
      })
  }

  productInitForm() {
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

  editProductInitForm() {
    this.editProductForm = this.formBuilder.group({
      name: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      description: ['', [CustomValidators.required, CustomValidators.minLength(3)]],
      stock: ['', [CustomValidators.required, CustomValidators.numericType()]],
      price: ['', [CustomValidators.required, CustomValidators.numericDecimalType()]],
      discount: ['', [CustomValidators.numericDecimalType()]],
      product_type: ['', [CustomValidators.required]],
      image: ['', [CustomValidators.fileSizeValidator(5 * 1024 * 1024)]],
      id_brands: ['', [CustomValidators.required]]
    });
  }

  onImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
    }
  }

  onImageEditUpload(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Asegurarse de que reader.result sea una cadena antes de asignarlo
        if (typeof reader.result === 'string') {
          this.currentImagePreview = reader.result;
        } else {
          // Asignar un valor predeterminado en caso de que reader.result no sea una cadena
          this.currentImagePreview = ''; // Asegúrate de reemplazar 'path/to/default/image.png' con la ruta real a tu imagen predeterminada.
        }
      };
      reader.readAsDataURL(file);
      this.imageFile = file;
    }
  }

  clearImageInput() {
    if (this.imageInputElement && this.imageInputElement.nativeElement) {
      this.imageInputElement.nativeElement.value = '';
      this.currentImagePreview = ''; // También limpia la vista previa de la imagen si es necesario
    }
  }

  editBrand(product: ProductResponse) {
    this.currentProductId = product.id;
    this.currentImagePreview = product.image;

    this.editProductForm.setValue({
      name: product.name,
      description: product.description,
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      product_type: product.product_type,
      image: this.currentImagePreview,
      id_brands: product.id_brands.id
    });
    this.showEditDialog();
  }

  onSubmitProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile as Blob);
    reader.onload = () => {
      let base64Image = reader.result as string;
      base64Image = base64Image.split(',')[1];
      const formValues = this.productForm.value;
      formValues.image = base64Image;
      formValues.id_brands = { id: formValues.id_brands };
      this.productStateService.createProduct(formValues).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Has creado un nuevo producto' });
          this.closeDialog();
          const brandControl = this.productForm.get('id_brands');
          if (brandControl) {
            brandControl.setValue('');
          }
          this.imageFile = undefined;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto' });
        }
      );
    };
    reader.onerror = (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al convertir la imagen' });
    };
  }

  onEditProduct() {
    if (this.editProductForm.invalid) {
      this.editProductForm.markAllAsTouched();
      return;
    }

    // Si no se seleccionó una nueva imagen, envía el formulario con la imagen actual.
    if (!this.imageFile) {
      const formValues = this.editProductForm.value;
      formValues.image = this.currentImagePreview;
      formValues.id_brands = { id: formValues.id_brands };

      this.sendForm(formValues);
      return;
    }

    // Si se seleccionó una nueva imagen, procede con la conversión y envío.
    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile as Blob);
    reader.onload = () => {
      let base64Image = reader.result as string;
      base64Image = base64Image.split(',')[1];
      const formValues = this.editProductForm.value;
      formValues.image = base64Image;
      formValues.id_brands = { id: formValues.id_brands };

      this.sendForm(formValues);
    };
    reader.onerror = (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al convertir la imagen' });
    };
  }

  sendForm(formValues: any) {
    const productId = this.currentProductId;
    this.productStateService.updateProduct(productId, formValues).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Has actualizado el producto' });
        this.closeEditDialog();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto' });
      }
    );
  }

  onDeleteProduct(product: ProductResponse) {
    this.productStateService.deleteProduct(product.id).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado correctamente' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto' });
      }
    );
  }

  confirmDelete(product: ProductResponse) {
    this.confirmationService.confirm({
      message: 'Estas seguro de querer eliminar este producto?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDeleteProduct(product);
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rechazada', detail: 'Has rechazado la eliminación' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelada', detail: 'Has cancelado la elimincación' });
            break;
        }
      }
    });
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  showDialog() {
    this.visibleCreateModal = true;
    this.productForm.reset();
  }


  closeDialog() {
    this.visibleCreateModal = false;
    this.productForm.reset();
  }

  showEditDialog() {
    this.visibleEditModal = true;
  }

  closeEditDialog() {
    this.visibleEditModal = false;
    this.clearImageInput();
  }
}
