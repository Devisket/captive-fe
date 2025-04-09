import { createAction, props } from '@ngrx/store';

export const setLoading = createAction(
  '[Shared] Set Loading',
  props<{ loading: boolean }>()
);

export const setError = createAction(
  '[Shared] Set Error',
  props<{ error: string | null }>()
);

export const setSelectedBankInfoId = createAction(
  '[Shared] Set Selected Bank Info Id',
  props<{ selectedBankInfoId: string }>()
);

export const setSelectedProductId = createAction(
  '[Shared] Set Selected Product Id',
  props<{ selectedProductId: string }>()
);

export const clearError = createAction('[Shared] Clear Error'); 