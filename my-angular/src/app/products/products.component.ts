import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  formVisible = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      title: [''],
      price: [''],
      description: [''],
      category: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }
  toggleForm() {
    this.formVisible = !this.formVisible;
  }
  loadProducts() {
    this.productService.getProducts().subscribe(
      data => {
        console.log('Fetched products:', data);
        this.products = data;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  

  addProduct() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe(
        response => {
          console.log('Product added:', response);
          this.loadProducts(); // Reload products to reflect the new addition
          this.productForm.reset();
        },
        error => {
          console.error('Error adding product:', error);
        }
      );
    }
  }
  

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  updateProduct(id: number) {
    if (this.productForm.valid) {
      this.productService.updateProduct(id, this.productForm.value).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
