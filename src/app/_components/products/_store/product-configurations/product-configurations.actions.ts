import { createAction, props } from "@ngrx/store";
import { ProductConfiguration } from "../../../../_models/product-configuration";

export const getProductConfiguration = createAction(
  '[ProductConfigurations] Get Product Configuration',
  props<{ productId: string }>()
);

export const getProductConfigurationSuccess = createAction(
  '[ProductConfigurations] Get Product Configuration Success',
  props<{ configuration: ProductConfiguration}>()
)

export const getProductConfigurationFailure = createAction(
  '[ProductConfigurations] Get Product Configuration Failure',
  props<{ error: any }>()
);

export const createProductConfiguration = createAction(
  '[ProductConfigurations] Create Product Configuration',
  props<{ productId: string; configuration: ProductConfiguration }>()
);

export const updateProductConfiguration = createAction(
  '[ProductConfigurations] Update Product Configuration',
  props<{ productId: string; configuration: ProductConfiguration }>()
);

export const resetProductConfiguration = createAction(
  '[ProductConfigurations] Reset Product Configuration'
);






