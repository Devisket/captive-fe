import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductsState } from "./products.reducer";



export const selectProductState = createFeatureSelector<ProductsState>('products');

export const getAllStateProducts = createSelector(
  selectProductState,
  (state: ProductsState) => state.products
);






