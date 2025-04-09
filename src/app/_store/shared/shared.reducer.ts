import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { initialState } from './shared.state';
import {
  setLoading,
  setError,
  clearError,
  setSelectedBankInfoId,
  setSelectedProductId,
} from './shared.actions';

const reducer = createReducer(
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
  }),
  on(setSelectedProductId, (state, { selectedProductId }) => {
    sessionStorage.setItem('selectedProductId', selectedProductId);

    return {
      ...state,
      selectedProductId,
    };
  })
);

export const SharedFeature = createFeature({
  name: 'shared',
  reducer: reducer,
  extraSelectors: ({ selectSelectedBankInfoId, selectSelectedProductId }) => ({
    selectSelectedBankInfoId: createSelector(
      selectSelectedBankInfoId,
      (selectedBankInfoId: string | null) => {
        if(!selectedBankInfoId){
          return sessionStorage.getItem('selectedBankInfoId');
        }
        return selectedBankInfoId;
      }
    ),
    selectSelectedProductId: createSelector(
      selectSelectedProductId,
      (selectedProductId: string | null) => {
        if(!selectedProductId){
          return sessionStorage.getItem('selectedProductId');
        }
        return selectedProductId;
      }
    ),
  }),
});


