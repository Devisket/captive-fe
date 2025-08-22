import { ProductConfiguration } from '../../../_models/product-configuration';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  getProductConfigurationFailure,
  getProductConfigurationSuccess,
  getProductConfiguration,
  createProductConfiguration,
  updateProductConfiguration,
  resetProductConfiguration,
} from './product-configurations.actions';

export interface ProductConfigurationState {
  productConfiguration: ProductConfiguration | undefined;
  loading: boolean;
  error: any;
}

export const initialState: ProductConfigurationState = {
  productConfiguration: undefined,
  loading: false,
  error: null,
};

export const productConfigurationReducer = createReducer(
  initialState,
  on(getProductConfiguration, (state) => ({ ...state, loading: true })),
  on(getProductConfigurationSuccess, (state, { configuration }) => ({
    ...state,
    productConfiguration: configuration,
    loading: false,
  })),
  on(getProductConfigurationFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createProductConfiguration, (state, { configuration }) => ({
    ...state,
    productConfiguration: configuration,
    loading: false,
  })),
  on(updateProductConfiguration, (state, { configuration }) => ({
    ...state,
    productConfiguration: configuration,
    loading: false,
  })),
  on(resetProductConfiguration, (state) => ({
    ...state,
    productConfiguration: undefined,
    loading: false,
    error: null,
  }))
);

export const ProductConfigurationFeature = createFeature({
  name: 'productConfiguration',
  reducer: productConfigurationReducer,
});
