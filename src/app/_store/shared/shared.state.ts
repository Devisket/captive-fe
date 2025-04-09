import { BankValues } from "../../_models/values/bankValues";

export interface SharedState {
  selectedBankInfoId: string | null;
  selectedProductId: string | null;
  bankValues: BankValues;
  loading: boolean;
  error: string | null;
}

export const initialState: SharedState = {
  selectedBankInfoId: null,
  selectedProductId: null,
  bankValues: {
    branchValues: [],
    productValues: [],
    formCheckValues: [],
  },
  loading: false,
  error: null
}; 