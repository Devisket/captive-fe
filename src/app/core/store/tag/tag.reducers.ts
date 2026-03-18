import { createFeature, createReducer, on } from '@ngrx/store';
import {
  getCheckInventoryFailure,
  getCheckInventorySuccess,
  addNewCheckInventoryFailure,
  updateCheckInventoryFailure,
  deleteCheckInventoryFailure,
} from './tag.actions';
import { CheckInventory } from '../../../_models/check-inventory';

export interface TagState {
  checkInventories: CheckInventory[];
  totalRecords: number;
  error: string | null;
}

const initialState: TagState = {
  checkInventories: [],
  totalRecords: 0,
  error: null,
};

export const TagFeature = createFeature({
  name: 'checkInventory',
  reducer: createReducer(
    initialState,
    on(getCheckInventorySuccess, (state, { checkInventoryResponse }) => ({
      ...state,
      checkInventories: checkInventoryResponse.checkInventories,
      totalRecords: checkInventoryResponse.totalCount,
    })),
    on(getCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(addNewCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(updateCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(deleteCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
});
