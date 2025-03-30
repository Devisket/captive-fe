import { createFeature, createReducer, on } from "@ngrx/store";
import { Product } from "../../_models/product";
import { getAllProductsSuccess, deleteProductSuccess } from "./products.actions";

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

export const productsFeature = createFeature({
  name: 'products',
  reducer: productsReducer,
});
