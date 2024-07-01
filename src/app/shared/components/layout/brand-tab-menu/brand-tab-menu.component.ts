import { Component, OnInit } from '@angular/core';
import { BrandStateService } from '../../services/brand-state-service.service';
import { BrandResponse } from 'src/app/shared/models/interfaces/brand.interface';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, ConfirmEventType, Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from '../../utils/Validations/CustomValidators';

@Component({
  selector: 'app-brand-tab-menu',
  templateUrl: './brand-tab-menu.component.html',
  styleUrls: ['./brand-tab-menu.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class BrandTabMenuComponent implements OnInit {
  currentBrandId!: number;
  brands: BrandResponse[] = [];
  messages!: Message[];
  brandForm!: FormGroup;
  editBrandForm!: FormGroup;
  visible: boolean = false;
  editVisible: boolean = false;

  constructor(
    private brandtStateService: BrandStateService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getBrandsState();
    this.brandInitForm();
    this.editBrandInitForm();
    this.messages = [];
  }

  getBrandsState() {
    this.brandtStateService.loadBrands();
    this.brandtStateService.brands$
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: `Error al cargar las marcas: ${error.name} ${error.statusText}` }
          ]
          return throwError(() => error);
        })
      ).subscribe((brands: BrandResponse[]) => {
        this.brands = brands;
      });
  }

  brandInitForm() {
    this.brandForm = this.formBuilder.group({
      brandName: ['', [CustomValidators.required, CustomValidators.minLength(3)]]
    });
  }

  editBrandInitForm() {
    this.editBrandForm = this.formBuilder.group({
      brandName: ['', [CustomValidators.required, CustomValidators.minLength(3)]]
    });
  }

  editBrand(brand: BrandResponse) {
    this.currentBrandId = brand.id;

    this.editBrandForm.setValue({
      brandName: brand.brandName
    });

    this.showEditDialog();
  }


  OnSubmitBrand() {
    if (this.brandForm.valid) {
      this.brandtStateService.createProduct(this.brandForm.value).subscribe(
        (response) => {
          this.messages = [
            { severity: 'success', summary: 'Éxito', detail: 'Marca creada correctamente', life: 3000 },
          ]
          this.brandForm.reset();
          this.visible = false;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la marca' });
        }
      );
    } else {
      this.brandForm.markAllAsTouched();
    }
  }

  onEditBrand() {
    if (this.editBrandForm.valid) {
      const brandRequest = this.editBrandForm.value;
      const brandId = this.currentBrandId;
      this.brandtStateService.updateBrand(brandId, brandRequest).subscribe(
        (response) => {
          this.messages = [
            { severity: 'success', summary: 'Éxito', detail: 'Marca actualizada correctamente', life: 3000 },
          ];
          this.closeEditDialog();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la marca' });
        }
      );
    } else {
      this.editBrandForm.markAllAsTouched();
    }
  }

  onDeleteBrand(brand: BrandResponse) {
    this.brandtStateService.deleteBrand(brand.id).subscribe(
      (response) => {
        this.messages = [
          { severity: 'success', summary: 'Éxito', detail: 'Marca eliminada correctamente', life: 3000 },
        ];
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la marca' });
      }
    );
  }

  confirmDelete(brand: BrandResponse) {
    this.confirmationService.confirm({
      message: 'Estas seguro de querer eliminar esta marca?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.onDeleteBrand(brand);
        // this.messageService.add({ severity: 'info', summary: 'Eliminación confirmada', detail: 'Marca eliminada' });
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

  showDialog() {
    this.visible = true;
    this.brandForm.reset();
  }


  closeDialog() {
    this.visible = false;
    this.brandForm.reset();
  }

  showEditDialog() {
    this.editVisible = true;
  }

  closeEditDialog() {
    this.editVisible = false;
  }
}
