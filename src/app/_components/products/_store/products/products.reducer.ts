import { createFeature, createReducer, on } from '@ngrx/store';

import {
  createProduct,
  createProductFailure,
  deleteProduct,
  deleteProductFailure,
  getAllProducts,
  getAllProductsSuccess,
  resetProducts,
  updateProduct,
  updateProductFailure,
} from './products.actions';
import { Product } from '../../../../_models/product';
export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error:any;
}

export const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(getAllProductsSuccess, (state, { products }) => {
    return {
      ...state,
      products: products,
    };
  }),
  on(createProductFailure, (state, { error }) => {
    return {
      ...state,
      error: error,
    };
  }),
  on(deleteProductFailure, (state, { error }) => {
    return {
      ...state,
      error: error,
    };
  }),
  on(updateProductFailure, (state, { error }) => {
    return {
      ...state,
      error: error,
    };
  }),
  on(getAllProducts, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(createProduct, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(deleteProduct, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(updateProduct, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(resetProducts, (state) => {
    return {
      ...state,
      products: [],
      isLoading: false,
      error: null,
    };
  })
);

export const ProductsFeature = createFeature({
  name: 'products',
  reducer: productsReducer,
});
