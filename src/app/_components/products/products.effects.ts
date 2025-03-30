import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../../_services/product.service';
import {
  getAllProductsSuccess,
  getAllProducts,
  createProduct,
  createProductSuccess,
  createProductFailure,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure,
} from './products.actions';
import { exhaustMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getSelectedBankInfoId } from '../../_store/shared/shared.selectors';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private router = inject(Router);
  private store = inject(Store);

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getAllProducts),
      exhaustMap(({ bankInfoId }) => {
        return this.productService
          .getAllProducts(bankInfoId)
          .pipe(
            map((response) => {
              console.log(response);
              return getAllProductsSuccess({ products: response });
            })
          );
      })
    );
  });

  createProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createProduct),
      mergeMap(({ bankInfoId, productName }) => {
        return this.productService.addProductType(bankInfoId, productName).pipe(
          mergeMap(() => this.productService.getAllProducts(bankInfoId)),
          map((products) =>
            getAllProductsSuccess({ products: products.productTypes })
          ),
          tap(() => this.router.navigate(['/banks', bankInfoId])),
          catchError((error) => of(createProductFailure({ error })))
        );
      })
    );
  });

  deleteProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(({ id }) => {
        return this.store.select(getSelectedBankInfoId).pipe(
          mergeMap((bankInfoId) => {
            if (!bankInfoId)
              return of(deleteProductFailure({ error: 'No bank selected' }));
            return this.productService.deleteProductType(bankInfoId, id).pipe(
              map(() => deleteProductSuccess({ id })),
              catchError((error) => of(deleteProductFailure({ error })))
            );
          })
        );
      })
    );
  });
}
