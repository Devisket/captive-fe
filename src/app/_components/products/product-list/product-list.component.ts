import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  getAllProducts,
  deleteProduct,
} from '../_store/products/products.actions';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { ProductsFeature } from '../_store/products/products.reducer';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, TableModule, ButtonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  visibleProductTypes: { [key: string]: boolean } = {};
  bankId: string | undefined = undefined;
  products$: Observable<Product[]>;

  products: Product[] = [];

  constructor(
    private store: Store,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.products$ = this.store.select(ProductsFeature.selectProducts);
  }

  ngOnInit(): void {
    this.products$.subscribe((products) => {
      console.log(products);
      this.products = products;
      console.log(this.products);
    });

    this.store
      .select(SharedFeature.selectSelectedBankInfoId)
      .subscribe((bankId) => {
        if (bankId) {
          this.bankId = bankId as string;
          this.loadProducts();
        }
      });
  }

  loadProducts() {
    this.store.dispatch(getAllProducts({ bankInfoId: this.bankId! }));
  }

  deleteProductType(productId: string, event: Event) {
    event.preventDefault();
    if (!confirm('Confirm Deletion!')) {
      return;
    }
    this.store.dispatch(deleteProduct({ id: productId }));
  }
}
