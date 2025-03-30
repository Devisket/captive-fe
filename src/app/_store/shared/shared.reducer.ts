import { createReducer, on } from '@ngrx/store';
import { initialState } from './shared.state';
import {
  setLoading,
  setError,
  clearError,
  setSelectedBankInfoId,
} from './shared.actions';

export const sharedReducer = createReducer(
  initialState,
  on(setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
  on(setError, (state, { error }) => ({
    ...state,
    error,
  })),
  on(clearError, (state) => ({
    ...state,
    error: null,
  })),
  on(setSelectedBankInfoId, (state, { selectedBankInfoId }) => {
    sessionStorage.setItem('selectedBankInfoId', selectedBankInfoId);

    return {
      ...state,
      selectedBankInfoId,
    };
  })
);
