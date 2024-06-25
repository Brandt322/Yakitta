import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './global/loader/loader.component';
import { LoaderService } from './global/loader/loader.service';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [LoaderComponent],
  providers: [LoaderService]
})
export class CoreModule { }
