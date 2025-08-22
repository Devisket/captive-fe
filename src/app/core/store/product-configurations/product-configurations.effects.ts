import { createEffect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { ProductConfigurationService } from '../../_services/product-configuration.service';
import {
  createProductConfiguration,
  getProductConfiguration,
  getProductConfigurationFailure,
  getProductConfigurationSuccess,
  updateProductConfiguration,
} from './product-configurations.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductConfigurationsEffects {
  constructor(
    private actions$: Actions,
    private productConfigurationsService: ProductConfigurationService
  ) {}

  getAllProductConfigurations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProductConfiguration),
      mergeMap(({ productId }) =>
        this.productConfigurationsService
          .getProductConfigurations(productId)
          .pipe(
            map((configuration) =>
              getProductConfigurationSuccess({ configuration })
            ),
            catchError((error) => of(getProductConfigurationFailure({ error })))
          )
      )
    )
  );

  addProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProductConfiguration),
      mergeMap(({ productId, configuration }) =>
        this.productConfigurationsService
          .addProductConfigurations(productId, configuration)
          .pipe(
            map(
              () => getProductConfiguration({ productId }),
              catchError((error) =>
                of(getProductConfigurationFailure({ error }))
              )
            )
          )
      )
    )
  );

  updateProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProductConfiguration),
      mergeMap(({ productId, configuration }) =>
        this.productConfigurationsService
          .updateProductConfigurations(
            productId,
            configuration.id,
            configuration
          )
          .pipe(
            map(() => getProductConfiguration({ productId })),
            catchError((error) => of(getProductConfigurationFailure({ error })))
          )
      )
    )
  );
}
