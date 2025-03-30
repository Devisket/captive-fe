import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedState } from './shared.state';

export const selectSharedState = createFeatureSelector<SharedState>('shared');

export const selectLoading = createSelector(
  selectSharedState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectSharedState,
  (state) => state.error
);

export const getSelectedBankInfoId = createSelector(
  selectSharedState,
  (state) => {
    const selectedBankInfoId = sessionStorage.getItem('selectedBankInfoId');
    if (state.selectedBankInfoId) {
      return state.selectedBankInfoId;
    } else if (selectedBankInfoId) {
      return selectedBankInfoId;
    }else{
      window.location.href = '/bank-list';
      return '';
    }
  }
);
