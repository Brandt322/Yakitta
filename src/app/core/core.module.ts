import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './global/loader/loader.component';
import { LoaderService } from './global/loader/loader.service';



@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent],
  providers: [LoaderService]
})
export class CoreModule { }
