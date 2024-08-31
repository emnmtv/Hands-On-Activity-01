import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  formVisible = true;
  isEditMode = false;
  currentProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      category: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  toggleForm() {
    this.formVisible = !this.formVisible;
    if (!this.formVisible) {
      this.resetForm();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      data => {
        console.log('Fetched products:', data);
        this.products = data;
        this.filteredProducts = data; // Initialize filteredProducts with all products
        this.getCategories(); // Extract categories from products
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  getCategories() {
    this.categories = [...new Set(this.products.map(product => product.category))];
  }

  filterByCategory(event: any) {
    const selectedCategory = event.target.value;
    this.filteredProducts = selectedCategory ? 
      this.products.filter(product => product.category === selectedCategory) :
      this.products;
  }

  sortByPrice(event: any) {
    const sortOrder = event.target.value;
    if (sortOrder === 'lowToHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditMode && this.currentProductId !== null) {
        // Update the product
        this.updateProduct(this.currentProductId, this.productForm.value);
      } else {
        // Add a new product
        this.addProduct();
      }
    }
  }

  addProduct() {
    const newProduct = this.productForm.value;

    this.productService.addProduct(newProduct).subscribe(
      response => {
        console.log('Product added:', response);
        this.products.push(response); // Add the new product to the list
        this.filteredProducts.push(response); // Also add to the filtered list
        this.getCategories(); // Update the categories list
        this.resetForm(); // Reset form after submission
      },
      error => {
        console.error('Error adding product:', error);
      }
    );
  }

  editProduct(product: any) {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
    this.formVisible = true; // Show the form when editing
  }

  updateProduct(id: number, updatedProduct: any) {
    this.productService.updateProduct(id, updatedProduct).subscribe(
      () => {
        this.loadProducts(); // Reload products to reflect the update
        this.resetForm(); // Reset form after update
      },
      error => {
        console.error('Error updating product:', error);
      }
    );
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  // New method to cancel editing
  cancelEdit() {
    this.resetForm(); // Reset form fields and state
    this.formVisible = false; // Hide the form after canceling
  }

  resetForm() {
    this.productForm.reset();
    this.isEditMode = false;
    this.currentProductId = null;
  }
}
