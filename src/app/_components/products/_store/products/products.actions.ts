import { createAction, props } from '@ngrx/store';
import { Product } from '../../../../_models/product';

export const getAllProducts = createAction(
  '[Products] Get All Products',
  props<{ bankId: string }>()
);

export const resetProducts = createAction('[Products] Reset Products');

export const getAllProductsSuccess = createAction(
  '[Products] Get All Products Success',
  props<{ products: Product[] }>()
);

export const createProduct = createAction(
  '[Products] Create Product',
  props<{ bankId: string; product: Product }>()
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: any }>()
);

export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ bankId: string; id: string }>()
);

export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: any }>()
);

export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ bankId: string; product: Product }>()
);

export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: any }>()
);
