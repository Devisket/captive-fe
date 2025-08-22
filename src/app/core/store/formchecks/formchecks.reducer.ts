import { createFeature, createReducer, on } from '@ngrx/store';
import { FormCheck } from '../../../_models/form-check';
import {
  createFormCheckFailure,
  updateFormCheckFailure,
  getAllFormChecksSuccess,
  deleteFormCheckFailure,
  getAllFormChecks,
  getAllFormChecksFailure,
} from './formchecks.action';

export interface FormChecksState {
  formChecks: FormCheck[];
  loading: boolean;
  error: any;
}

export const initialState: FormChecksState = {
  formChecks: [],
  loading: false,
  error: null,
};

export const formChecksReducer = createReducer(
  initialState,
  on(getAllFormChecks, (state) => ({ ...state, loading: true })),
  on(getAllFormChecksSuccess, (state, { formChecks }) => ({
    ...state,
    formChecks,
    loading: false,
  })),
  on(getAllFormChecksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createFormCheckFailure, (state, { error }) => ({ ...state, error })),
  on(updateFormCheckFailure, (state, { error }) => ({ ...state, error })),
  on(deleteFormCheckFailure, (state, { error }) => ({ ...state, error }))
);
  
export const FormChecksFeature = createFeature({
  name: 'formChecks',
  reducer: formChecksReducer,
});
