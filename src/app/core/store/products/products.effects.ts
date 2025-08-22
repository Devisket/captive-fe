import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../../_services/product.service';
import {
  getAllProductsSuccess,
  getAllProducts,
  createProduct,
  createProductFailure,
  deleteProduct,
  deleteProductFailure,
  updateProduct,
  updateProductFailure,
} from './products.actions';
import { exhaustMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private router = inject(Router);

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getAllProducts),
      exhaustMap(({ bankId }) => {
        return this.productService.getAllProducts(bankId).pipe(
          map((response) => {
            return getAllProductsSuccess({ products: response });
          })
        );
      })
    );
  });

  createProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createProduct),
      mergeMap(({ bankId, product }) => {
        return this.productService.addProduct(bankId, product).pipe(
          mergeMap(() => this.productService.getAllProducts(bankId)),
          map(() => getAllProducts({ bankId })),
          catchError((error) => of(createProductFailure({ error })))
        );
      })
    );
  });

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProduct),
      mergeMap(({ bankId, product }) =>
        this.productService
          .updateProduct(bankId, product.productId, product)
          .pipe(
            map(() => getAllProducts({ bankId: bankId })),
            catchError((error) => of(updateProductFailure({ error })))
          )
      )
    )
  );

  deleteProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(({ bankId, id }) => {
        return this.productService.deleteProduct(bankId, id).pipe(
          map(() => getAllProducts({ bankId: bankId })),
          catchError((error) => of(deleteProductFailure({ error })))
        );
      })
    );
  });
}
