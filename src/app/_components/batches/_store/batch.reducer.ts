
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  getAllBatches,
  getAllBatchesFailure,
  getAllBatchesSuccess,
  createNewBatchFailure,
  deleteBatchFailure,
} from './batch.actions';
import { Batch } from '../../../_models/batch';

export interface BatchState {
  batches: Batch[];
  loading: boolean;
  error: any;
}

export const initialState: BatchState = {
  batches: [],
  loading: false,
  error: null,
};

export const batchReducer = createReducer(
  initialState,
  on(getAllBatches, (state) => ({ ...state, loading: true })),
  on(getAllBatchesSuccess, (state, { batches }) => ({
    ...state,
    batches,
    loading: false,
  })),
  on(getAllBatchesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createNewBatchFailure, (state, { error }) => ({ ...state, error })),
  on(deleteBatchFailure, (state, { error }) => ({ ...state, error }))
);

export const BatchFeature = createFeature({
  name: 'batch',
  reducer: batchReducer,
});
