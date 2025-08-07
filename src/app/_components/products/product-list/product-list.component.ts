import { Component, OnInit } from '@angular/core';
import { Product } from '../../../_models/product';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  resetProducts,
} from '../_store/products/products.actions';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { ProductsFeature } from '../_store/products/products.reducer';
import { DialogService } from 'primeng/dynamicdialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  visibleProductTypes: { [key: string]: boolean } = {};
  bankId: string | undefined = undefined;
  products$: Observable<Product[]>;

  products: Product[] = [];

  clonedProduct: Product | undefined = undefined;

  subscription$: Subscription = new Subscription();
  constructor(private store: Store, private dialogService: DialogService) {
    this.products$ = this.store.select(ProductsFeature.selectProducts);
  }

  ngOnInit(): void {
    this.subscription$.add(
      this.products$.subscribe((products) => {
        this.products = products.map((product) => ({ ...product }));
      })
    );

    this.subscription$.add(
      this.store
        .select(SharedFeature.selectSelectedBankInfoId)
        .subscribe((bankId) => {
          if (bankId) {
            this.bankId = bankId as string;
            this.loadProducts();
          }
        })
    );
  }

  loadProducts() {
    this.store.dispatch(getAllProducts({ bankId: this.bankId! }));
  }

  deleteProductType(productId: string, event: Event) {
    event.preventDefault();
    if (!confirm('Confirm Deletion!')) {
      return;
    }
    this.store.dispatch(deleteProduct({ bankId: this.bankId!, id: productId }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.store.dispatch(resetProducts());
  }

  openAddProductButtonClick(product?: Product) {
    this.dialogService.open(AddProductComponent, {
      header: product ? 'Update Product' : 'Add Product',
      width: '500px',
      closable: true,
      focusOnShow: true,
      closeOnEscape: true,
      style: {
        'max-height': '500px',
        'min-width': '500px',
        overflow: 'auto',
        padding: '0px',
      },
      data: {
        productId: product?.productId,
        bankId: this.bankId,
      },
    });
  }

  onRowEditInit(product: Product) {
    this.clonedProduct = { ...product };
  }

  onRowEditSave(product: Product) {
    console.log(product);
    this.store.dispatch(
      updateProduct({ bankId: this.bankId!, product: product })
    );
  }

  onCancelEdit(product: Product) {
    if (this.clonedProduct) {
      const index = this.products.findIndex(
        (p) => p.productId === product.productId
      );
      if (index !== -1) {
        this.products[index] = { ...this.clonedProduct };
      }
    }
    this.clonedProduct = undefined;
  }
}
