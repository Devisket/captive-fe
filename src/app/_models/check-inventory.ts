export interface CheckInventory {
  id?: string;
  bankId: string;
  seriesPattern: string;
  warningSeries: number;
  numberOfPadding: number;
  startingSeries: number;
  endingSeries: number;
  currentSeries: number;
  isRepeating: boolean;
  isActive: boolean;
  accountNumber?: string;
  mappingData: CheckInventoryMappingData;
}

export interface CheckInventoryViewData {
  id?: string;
  bankId: string;
  seriesPattern: string;
  warningSeries: number;
  numberOfPadding: number;
  startingSeries: number;
  endingSeries: number;
  currentSeries: number;
  isRepeating: boolean;
  isActive: boolean;
  accountNumber?: string;
  viewMappingData: CheckInventoryViewMappingData;
}

export interface CheckInventoryMappingData {
  branchIds?: string[];
  productIds?: string[];
  formCheckType?: string[];
}

export interface CheckInventoryViewMappingData {
  branches?: string[];
  products?: string[];
  formCheckTypes?: string[];
}

export interface CheckInventoryQueryRequest {
  bankId: string;
  branchIds?: string[];
  productIds?: string[];
  formCheckType?: string[];
  isActive?: boolean;
  isRepeating?: boolean;
  currentPage: number;
  pageSize: number;
}

export interface CheckInventoryResponse {
  checkInventories: CheckInventory[];
  totalCount: number;
}

export interface ImportCheckInventoryResult {
  created: number;
  deprecated: number;
  errors: string[];
  warnings: string[];
}
