import { createFeature, createReducer, on } from '@ngrx/store';
import { BankBranch } from '../../../_models/bank-branch';
import * as BranchActions from './branch.actions';

export interface BranchState {
  branches: BankBranch[];
  error: any;
  loading: boolean;
}

const initialState: BranchState = {
  branches: [],
  error: null,
  loading: false,
};

export const branchReducer = createReducer(
  initialState,

  on(BranchActions.getAllBranches, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchActions.getAllBranchesSuccess, (state, { branches }) => ({
    ...state,
    branches,
    loading: false,
  })),

  on(BranchActions.getAllBranchesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(BranchActions.createNewBranch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchActions.createNewBranchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(BranchActions.updateBranch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchActions.updateBranchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(BranchActions.deleteBranch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchActions.deleteBranchFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export const BranchFeature = createFeature({
  name: 'branch',
  reducer: branchReducer,
});
