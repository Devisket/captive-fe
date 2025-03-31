import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { getSelectedBankInfoId } from '../../../_store/shared/shared.selectors';
import { Observable, map } from 'rxjs';
import { getAllStateProducts } from '../_store/products/products.selector';
import { getAllProducts, deleteProduct } from '../_store/products/products.actions';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    AsyncPipe,
  ],
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
    this.products$ = this.store.select(getAllStateProducts);
  }

  ngOnInit(): void {

    this.products$.subscribe((products) => {
      this.products = products;
      console.log(this.products);
    });

    this.store.select(getSelectedBankInfoId).subscribe((bankId) => {
      console.log("Bank ID", bankId);
      this.bankId = bankId!;
      if (this.bankId) {
        console.log("Bank ID", this.bankId);  
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
