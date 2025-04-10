import { createFeature, createReducer } from '@ngrx/store';
import { on } from '@ngrx/store';
import { OrderFile } from '../../../_models/order-file';
import {
  createFloatingCheckOrder,
  createFloatingCheckOrderFailure,
  deleteFloatingCheckOrder,
  deleteFloatingCheckOrderFailure,
  getFloatingCheckOrders,
  getFloatingCheckOrdersFailure,
  getFloatingCheckOrdersSuccess,
  getOrderFiles,
  getOrderFilesFailure,
  updateFloatingCheckOrderFailure,
  processOrderFile,
  processOrderFileFailure,
  uploadOrderFiles,
  uploadOrderFilesFailure,
  validateOrderFile,
  validateOrderFileFailure,
  updateFloatingCheckOrder,
  holdFloatingCheckOrder,
  holdFloatingCheckOrderFailure,
  releaseFloatingCheckOrderFailure,
  releaseFloatingCheckOrder,
  getOrderFilesSuccess,
  processOrderFileSuccess,
} from './order-file.actions';
export interface OrderFileState {
  orderFiles: OrderFile[];
  error: any | undefined;
  loading: boolean;
  warning: string[] | undefined;
  log: any | undefined;
}

export const initialState: OrderFileState = {
  orderFiles: [],
  error: undefined,
  loading: false,
  warning: undefined,
  log: undefined,
};

export const orderFileReducer = createReducer(
  initialState,
  on(getOrderFiles, (state) => ({ ...state, loading: true })),
  on(getOrderFilesSuccess, (state, { orderFiles }) => ({
    ...state,
    orderFiles,
    loading: false,
  })),
  on(getOrderFilesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(uploadOrderFiles, (state) => ({ ...state, loading: true })),
  on(uploadOrderFilesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(validateOrderFile, (state) => ({ ...state, loading: true })),
  on(validateOrderFileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(processOrderFile, (state) => ({ ...state, loading: true })),
  on(processOrderFileSuccess, (state, { response }) => ({
    ...state,
    log: response,
    loading: false,
  })),
  on(processOrderFileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(getFloatingCheckOrders, (state) => ({ ...state, loading: true })),
  on(getFloatingCheckOrdersSuccess, (state, { checkOrders, orderFileId }) => ({
    ...state,
    orderFiles: state.orderFiles.map((orderFile) =>
      orderFile.id === orderFileId ? { ...orderFile, checkOrders } : orderFile
    ),
    loading: false,
  })),
  on(getFloatingCheckOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createFloatingCheckOrder, (state) => ({ ...state, loading: true })),
  on(createFloatingCheckOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(updateFloatingCheckOrder, (state) => ({ ...state, loading: true })),
  on(updateFloatingCheckOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(deleteFloatingCheckOrder, (state) => ({ ...state, loading: true })),
  on(deleteFloatingCheckOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(holdFloatingCheckOrder, (state) => ({ ...state, loading: true })),
  on(holdFloatingCheckOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(releaseFloatingCheckOrder, (state) => ({ ...state, loading: true })),
  on(releaseFloatingCheckOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
export const OrderFileFeature = createFeature({
  name: 'orderFiles',
  reducer: orderFileReducer,
});

