import { createFeature, createReducer, on } from "@ngrx/store";

import { getAllProductsSuccess, deleteProductSuccess } from "./products.actions";
import { Product } from "../../../../_models/product";
export interface ProductsState {
    products: Product[];
}

export const initialState: ProductsState = {
    products: [],
}

export const productsReducer = createReducer(
  initialState,
  on(getAllProductsSuccess,  (state, { products }) => {
    console.log("Product success", products);
    return {
      ...state,
      products: products,
    }
  }),
  on(deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(product => product.productId !== id)
  }))
);

export const ProductsFeature = createFeature({
  name: 'products',
  reducer: productsReducer,
});
