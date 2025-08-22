import { createAction, props } from '@ngrx/store';
import { CreateUpdateBankRequest } from '../../../_models/requests/create-bank';
import { Bank } from '../../../_models/bank';

export const getAllBanks = createAction('[Banks] Get All Banks');

export const getAllBanksSuccess = createAction(
  '[Banks] Get All Banks Success',
  props<{ bankInfos: Bank[] }>()
);

export const createBank = createAction(
  '[Banks] Create Bank',
  props<{ request: CreateUpdateBankRequest }>()
);

export const updateBankInformation = createAction(
  '[Banks] Update Bank Information',
  props<{ request: CreateUpdateBankRequest }>()
);

export const createBankSuccess = createAction('[Banks] Create Bank Success');

export const updateBankInformationSuccess = createAction(
  '[Banks] Update Bank Information Success'
);
