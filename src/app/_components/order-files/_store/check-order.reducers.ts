import { createFeature, createReducer } from '@ngrx/store';
import { on } from '@ngrx/store';
import {
  saveCheckOrder,
  saveCheckOrderSuccess,
  saveCheckOrderFailure
} from './check-order.actions';

export interface CheckOrderState {
  loading: boolean;
  error: any | undefined;
  lastSavedResponse: any | undefined;
}

export const initialState: CheckOrderState = {
  loading: false,
  error: undefined,
  lastSavedResponse: undefined,
};

export const checkOrderReducer = createReducer(
  initialState,
  on(saveCheckOrder, (state) => ({ 
    ...state, 
    loading: true, 
    error: undefined 
  })),
  on(saveCheckOrderSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    lastSavedResponse: response,
    error: undefined
  })),
  on(saveCheckOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export const CheckOrderFeature = createFeature({
  name: 'checkOrder',
  reducer: checkOrderReducer,
});