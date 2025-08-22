import { createAction, props } from '@ngrx/store';
import { BankValues } from '../../_models/values/bankValues';

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

export const getBankValues = createAction(
  '[Shared] Get Bank Values',
  props<{ bankId: string }>()
);

export const getBankValuesSuccess = createAction(
  '[Shared] Get Bank Values Success',
  props<{ bankValues: BankValues }>()
);

export const getBankValuesFailure = createAction(
  '[Shared] Get Bank Values Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Shared] Clear Error');
