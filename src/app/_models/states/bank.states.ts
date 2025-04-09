import { Bank } from "../bank";

export interface BankState {
  bankInfos: Bank[];
  error: string | null;
  isLoading: boolean;
}


