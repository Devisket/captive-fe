export interface CheckInventory {
  id?: string;
  tagId: string;
  seriesPattern: string;
  warningSeries: number;
  numberOfPadding: number;
  startingSeries: number;
  endingSeries: number;
  currentSeries: number;
  isRepeating: boolean;
  isActive: boolean;
  mappingData: CheckInventoryMappingData;
}

export interface CheckInventoryViewData {
  id?: string;
  tagId: string;
  seriesPattern: string;
  warningSeries: number;
  numberOfPadding: number;
  startingSeries: number;
  endingSeries: number;
  currentSeries: number;
  isRepeating: boolean;
  isActive: boolean;
  viewMappingData: CheckInventoryViewMappingData;

}

export interface CheckInventoryMappingData {
  branchIds?:string[];
  productIds?:string[];
  formCheckType?:string[];
}

export interface CheckInventoryViewMappingData {
  branches?:string[];
  products?:string[];
  formCheckTypes?:string[];

}

export interface CheckInventoryQueryRequest {
  tagId: string;
  branchIds?: string[];
  productIds?: string[];
  formCheckType?: string[];
  isActive: boolean;
  isRepeating: boolean;
  currentPage: number;
  pageSize: number;
}

export interface CheckInventoryResponse {
  checkInventories: CheckInventory[];
  totalCount: number;
}
