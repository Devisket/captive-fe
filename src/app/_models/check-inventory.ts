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

/** A series range (booklet) assigned to a check order. */
export interface CheckInventoryDetail {
  id: string;
  checkInventoryId?: string | null;
  checkOrderId?: string | null;
  startingSeries?: string | null;
  endingSeries?: string | null;
  quantity: number;
  accountNumber?: string | null;
  checkOrderName?: string | null;
  orderFileName?: string | null;
  batchName?: string | null;
  createdDateTime: string;
}

export interface CheckInventoryDetailsQuery {
  bankId: string;
  /** Series assigned from this check inventory */
  checkInventoryId?: string;
  /** Series assigned to check orders without a check inventory (manual series) */
  unassigned?: boolean;
  search?: string;
  currentPage: number;
  pageSize: number;
}

export interface CheckInventoryDetailsResponse {
  details: CheckInventoryDetail[];
  totalCount: number;
}

export interface ImportCheckInventoryResult {
  created: number;
  deprecated: number;
  errors: string[];
  warnings: string[];
}
