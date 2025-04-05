import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { initialState } from './shared.state';
import {
  setLoading,
  setError,
  clearError,
  setSelectedBankInfoId,
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
  })
);

export const SharedFeature = createFeature({
  name: 'shared',
  reducer: reducer,
  extraSelectors: ({ selectSelectedBankInfoId }) => ({
    selectSelectedBankInfoId: createSelector(
      selectSelectedBankInfoId,
      (selectedBankInfoId: string | null) => {
        if(!selectedBankInfoId){
          return sessionStorage.getItem('selectedBankInfoId');
        }
        return selectedBankInfoId;
      }
    ),
  }),
});


