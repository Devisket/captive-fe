import { createAction, props } from '@ngrx/store';
import { CheckOrders } from '../../../_models/check-order';

export const saveCheckOrder = createAction(
  '[Check Order] Save Check Order',
  props<{ checkOrder: CheckOrders; bankId: string; batchId: string; orderFileId: string }>()
);

export const saveCheckOrderSuccess = createAction(
  '[Check Order] Save Check Order Success',
  props<{ response: any }>()
);

export const saveCheckOrderFailure = createAction(
  '[Check Order] Save Check Order Failure',
  props<{ error: any }>()
);