import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { CustomValidators } from '../../utils/Validations/CustomValidators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCart } from 'src/app/shared/models/interfaces/product.interface';
import { MessageService } from 'primeng/api';
import { SharedProductCart } from '../../services/shared-product-cart.service';
import { StripeService } from 'ngx-stripe';
import { StripeElements, StripeCardElement, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentIntentDto } from 'src/app/shared/models/interfaces/payment.interface';
import { UserPrincipal } from 'src/app/shared/models/interfaces/login.interface';
@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  stripeForm!: FormGroup;
  products: ProductCart[] = [];
  userDetails!: UserPrincipal;
  visible: boolean = false;
  currentIdPayment!: string;
  currentPaymentIntentDto!: PaymentIntentDto;

  constructor(
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private sharedProductCartService: SharedProductCart,
    private activatedRoute: ActivatedRoute,
    private stripeService: StripeService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { products: any };
    if (state && state.products) {
      // Aquí estan los productos pasados
      this.products = state.products;
      // console.log(state.products);
    }
  }

  elements!: StripeElements;
  card!: StripeCardElement;
  error: any;

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  cardOptions: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#31325F',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: '#87bbfd' }
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee'
      }
    },
    hidePostalCode: true
  };

  isStripeValid: boolean = false;

  ngOnInit(): void {
    this.stripeInitForm();
    // console.log('init: ', this.products);

    if (sessionStorage.getItem('user_data')) {
      const userData = sessionStorage.getItem('user_data') ? JSON.parse(sessionStorage.getItem('user_data') || '{}') : {};
      this.userDetails = userData.userPrincipal;
      this.sharedProductCartService.initializeCart(this.userDetails.id_user.toString());
    }

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', this.cardOptions);
          this.card.mount('#card-element');
          this.card.on('change', (event) => {
            this.isStripeValid = event.complete;
          });
        }
      });
  }

  stripeInitForm() {
    this.stripeForm = this.formBuilder.group({
      name: ['', [CustomValidators.required]],
      email: ['', [CustomValidators.required, CustomValidators.emailValidator()]]
    });
  }

  createToken() {
    if (this.stripeForm.invalid) {
      this.stripeForm.markAllAsTouched();
      return;
    }

    const name = this.stripeForm.get('name')?.value;
    const totalAmount = this.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const productDescriptions = this.products.map(product => product.name).join(', ');
    const products = this.products.map(product => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity
      };
    });

    this.stripeService
      .createToken(this.card, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          const paymentIntentDto: PaymentIntentDto = {
            token: result.token.id,
            amount: totalAmount,
            currency: 'PEN',
            description: productDescriptions,
            products: products,
            clientId: this.userDetails.id_user
          };
          this.paymentService.pay(paymentIntentDto).subscribe(
            (data: any) => {
              this.currentIdPayment = data.id;
              this.currentPaymentIntentDto = paymentIntentDto;
              this.showDialog();
            }
          );
          console.log(result.token.id);
          console.log(paymentIntentDto);
          this.error = undefined;
        } else if (result.error) {
          // Error creating the token
          this.error = result.error.message;
          console.log(result.error.message);
        }
      });
  }

  confirmPurchase() {
    if (this.currentIdPayment && this.currentPaymentIntentDto) {
      this.paymentService.confirm(this.currentIdPayment, this.currentPaymentIntentDto).subscribe(
        (data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Pago exitoso', detail: 'Gracias por tu compra!' });
          this.closeDialog();
          this.router.navigate(['/main/facturas']);
        }
      );
    }
  }

  cancelPurchase() {
    if (this.currentIdPayment) {
      this.paymentService.cancel(this.currentIdPayment).subscribe(
        (data: any) => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la compra' });
          this.router.navigate(['/main']);
        }
      );
    }
  }

  showDialog() {
    this.visible = true;
  }


  closeDialog() {
    this.visible = false;
  }

  volver() {
    this.router.navigate(['/main']);
  }
}
