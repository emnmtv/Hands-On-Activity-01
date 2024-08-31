import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ProductService } from './services/product.service';
import { BusinessLogicService } from './services/business-logic.service';
import { ProductsComponent } from './products/products.component';



@NgModule({
  declarations: [AppComponent,ProductsComponent,],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ProductService, BusinessLogicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
