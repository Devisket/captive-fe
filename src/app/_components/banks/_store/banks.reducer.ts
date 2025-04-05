import { BankState } from '../../../_models/states/bank.states';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  createBank,
  createBankSuccess,
  getAllBanks,
  getAllBanksSuccess,
  updateBankInformation,
  updateBankInformationSuccess,
} from './banks.actions';

export const initialState: BankState = {
  bankInfos: [],
  error: null,
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  //Create Bank Information
  on(createBank, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(createBankSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  //Update Bank Information
  on(updateBankInformation, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(updateBankInformationSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  //Get All Banks Information
  on(getAllBanks, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(getAllBanksSuccess, (state, { bankInfos }) => ({
    ...state,
    bankInfos,
    isLoading: false,
  }))
);

export const bankFeature = createFeature({
  name: 'bank',
  reducer: reducer,
});
