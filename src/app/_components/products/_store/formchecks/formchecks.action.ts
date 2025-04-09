import { createAction, props } from '@ngrx/store';
import { FormCheck } from '../../../../_models/form-check';

export const getAllFormChecks = createAction(
  '[FormChecks] Get All Form Checks',
  props<{ productId: string }>()
);

//Get All Form Checks
export const getAllFormChecksSuccess = createAction(
  '[FormChecks] Get All Form Checks Success',
  props<{ formChecks: FormCheck[] }>()
);

export const getAllFormChecksFailure = createAction(
  '[FormChecks] Get All Form Checks Failure',
  props<{ error: any }>()
);


//Get Form Check By Id
export const getFormCheckById = createAction(
  '[FormChecks] Get Form Check By Id',
  props<{ productId: string; formCheckId: string }>()
);

export const getFormCheckByIdSuccess = createAction(
  '[FormChecks] Get Form Check By Id Success',
  props<{ formCheck: FormCheck }>()
);

export const getFormCheckByIdFailure = createAction(
  '[FormChecks] Get Form Check By Id Failure',
  props<{ error: any }>()
);


//Create Form Check
export const createFormCheck = createAction(
  '[FormChecks] Create Form Check',
  props<{ productId: string; formCheck: FormCheck }>()
);

export const createFormCheckFailure = createAction(
  '[FormChecks] Create Form Check Failure',
  props<{ error: any }>()
);

//Update Form Check
export const updateFormCheck = createAction(
  '[FormChecks] Update Form Check',
  props<{ productId: string; formCheck: FormCheck }>()
);

export const updateFormCheckFailure = createAction(
  '[FormChecks] Update Form Check Failure',
  props<{ error: any }>()
);

//Delete Form Check
export const deleteFormCheck = createAction(
  '[FormChecks] Delete Form Check',
  props<{ productId: string; formCheckId: string }>()
);

export const deleteFormCheckFailure = createAction(
  '[FormChecks] Delete Form Check Failure',
  props<{ error: any }>()
);






