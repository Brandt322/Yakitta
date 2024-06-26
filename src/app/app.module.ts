import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';
import { LoginModule } from './auth/login.module';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { ServerErrorsInterceptor } from './core/interceptors/server-error.interceptor';
import { MessageService } from 'primeng/api';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    FeaturesModule,
    CoreModule,
    LoginModule,
    NgxStripeModule.forRoot('pk_test_51PVgUUGisRB4bWWu0bbQFXVfdcmK8JBTzDhwMstfZYNgAnpCHQwjyaA39P5UOhreTZbopmcqIJWmFxZGu0AhDjFE00PlfXo6Kt'),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
