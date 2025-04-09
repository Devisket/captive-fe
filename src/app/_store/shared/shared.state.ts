export interface SharedState {
  selectedBankInfoId: string | null;
  selectedProductId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: SharedState = {
  selectedBankInfoId: null,
  selectedProductId: null,
  loading: false,
  error: null
}; 