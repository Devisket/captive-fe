import { createAction, props } from "@ngrx/store";
import { Product } from "../../_models/product";

export const getAllProducts = createAction(
  '[Products] Get All Products',
  props<{ bankInfoId: string }>()
);

export const getAllProductsSuccess = createAction(
  '[Products] Get All Products Success',
  props<{ products: Product[] }>()
);

export const createProduct = createAction(
  '[Products] Create Product',
  props<{ bankInfoId: string, productName:string }>()
);

export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: any }>()
);

export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ id: string }>()
);

export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: string }>()
);

export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: any }>()
);

export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ product: any }>()
);







