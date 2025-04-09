import { props } from '@ngrx/store';
import { createAction } from '@ngrx/store';
import { BankBranch } from '../../../_models/bank-branch';

export const getAllBranches = createAction(
  '[Branch] Get All Branches',
  props<{ bankId: string }>()
);

export const getAllBranchesSuccess = createAction(
  '[Branch] Get All Branches Success',
  props<{ branches: BankBranch[] }>()
);

export const getAllBranchesFailure = createAction(
  '[Branch] Get All Branches Failure',
  props<{ error: any }>()
);

export const createNewBranch = createAction(
  '[Branch] Create New Branch',
  props<{ bankId: string; branch: BankBranch }>()
);

export const createNewBranchFailure = createAction(
  '[Branch] Create New Branch Failure',
  props<{ error: any }>()
);

export const deleteBranch = createAction(
  '[Branch] Delete Branch',
  props<{ bankId: string; branchId: string }>()
);

export const deleteBranchFailure = createAction(
  '[Branch] Delete Branch Failure',
  props<{ error: any }>()
);

export const updateBranch = createAction(
  '[Branch] Update Branch',
  props<{ bankId: string; branch: BankBranch }>()
);

export const updateBranchFailure = createAction(
  '[Branch] Update Branch Failure',
  props<{ error: any }>()
);
