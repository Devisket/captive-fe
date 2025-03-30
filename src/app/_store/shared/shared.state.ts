export interface SharedState {
  selectedBankInfoId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: SharedState = {
  selectedBankInfoId: null,
  loading: false,
  error: null
}; 