import { createAction, props } from '@ngrx/store';
import { OrderFile } from '../../../_models/order-file';
import { CheckOrders } from '../../../_models/check-order';
import { LogDto } from '../../../_models/log-dto';

// Order Files
export const getOrderFiles = createAction(
  '[Order File] Get Order Files',
  props<{ bankId: string; batchId: string }>()
);

export const getOrderFilesSuccess = createAction(
  '[Order File] Get Order Files Success',
  props<{ orderFiles: OrderFile[] }>()
);

export const getOrderFilesFailure = createAction(
  '[Order File] Get Order Files Failure',
  props<{ error: any }>()
);

export const uploadOrderFiles = createAction(
  '[Order File] Upload Order Files',
  props<{ formData: FormData; bankId: string; batchId: string }>()
);

export const uploadOrderFilesFailure = createAction(
  '[Order File] Upload Order Files Failure',
  props<{ error: any }>()
);

export const validateOrderFile = createAction(
  '[Order File] Validate Order File',
  props<{ bankId: string; batchId: string; orderFileId: string }>()
);

export const validateOrderFileFailure = createAction(
  '[Order File] Validate Order File Failure',
  props<{ error: any }>()
);


export const deleteOrderFile = createAction(
  '[Order File] Delete Order File',
  props<{ bankId: string; batchId: string; orderFileId: string }>()
);

export const deleteOrderFileFailure = createAction(
  '[Order File] Delete Order File Failure',
  props<{ error: any }>()
);


export const processOrderFile = createAction(
  '[Order File] Process Order File',
  props<{ bankId: string; batchId: string; orderFileId: string }>()
);

export const processOrderFileSuccess = createAction(
  '[Order File] Process Order File Success',
  props<{ response:any }>()
);

export const processOrderFileFailure = createAction(
  '[Order File] Process Order File Failure',
  props<{ error: any }>()
);

// Floating Check Orders
export const getFloatingCheckOrders = createAction(
  '[Order File] Get Floating Check Orders',
  props<{ orderFileId: string }>()
);

export const getFloatingCheckOrdersSuccess = createAction(
  '[Order File] Get Floating Check Orders Success',
  props<{ checkOrders: CheckOrders[]; orderFileId: string }>()
);

export const getFloatingCheckOrdersFailure = createAction(
  '[Order File] Get Floating Check Orders Failure',
  props<{ error: any }>()
);

export const createFloatingCheckOrder = createAction(
  '[Order File] Create Floating Check Order',
  props<{ batchId: string; bankId: string; orderFileId: string; checkOrders: CheckOrders[] }>()
);

export const createFloatingCheckOrderFailure = createAction(
  '[Order File] Create Floating Check Order Failure',
  props<{ error: any }>()
);

export const updateFloatingCheckOrder = createAction(
  '[Order File] Update Floating Check Order',
  props<{ bankId: string; batchId: string; orderFileId: string; checkOrders: CheckOrders[] }>()
);

export const updateFloatingCheckOrderFailure = createAction(
  '[Order File] Update Floating Check Order Failure',
  props<{ error: any }>()
);

export const deleteFloatingCheckOrder = createAction(
  '[Order File] Delete Floating Check Order',
  props<{ bankId: string; batchId: string; orderFileId: string; checkOrderId: string }>()
);

export const deleteFloatingCheckOrderFailure = createAction(
  '[Order File] Delete Floating Check Order Failure',
  props<{ error: any }>()
);

export const holdFloatingCheckOrder = createAction(
  '[Order File] Hold Floating Check Order',
  props<{ bankId: string; batchId: string; orderFileId: string; checkOrderId: string }>()
);

export const holdFloatingCheckOrderFailure = createAction(
  '[Order File] Hold Floating Check Order Failure',
  props<{ error: any }>()
);

export const releaseFloatingCheckOrder = createAction(
  '[Order File] Release Floating Check Order',
  props<{ bankId:string, batchId: string; orderFileId: string; checkOrderId: string }>()
);

export const releaseFloatingCheckOrderFailure = createAction(
  '[Order File] Release Floating Check Order Failure',
  props<{ error: any }>()
);

export const processAllOrderFiles = createAction(
  '[Order File] Process All Order Files',
  props<{ bankId: string, batchId: string }>()
);

export const processAllOrderFilesError = createAction(
  '[Order File] Process All Order Files Error',
  props<{ error: any }>()
);

export const validateAllOrderFiles = createAction(
  '[Order File] Validate All Order Files',
  props<{ bankId: string, batchId: string }>()
);

export const validateAllOrderFilesError = createAction(
  '[Order File] Validate All Order Files Error',
  props<{ error: any }>()
);







