export interface TagMapping {
  id?: string;
  tagId: string;
  mappings?: TagMappingData;
}


export interface TagMappingData {
  branchIds?: string[];
  productIds?: string[];
  formCheckType?: string[];
}


export interface CreateTagMappingRequest {
  id?: string;
  tagId: string;
  branchIds?: string[];
  productIds?: string[];
  formCheckType?: string[];
}


export interface TagMappingViewData{
  id?: string;
  tagId: string;
  products?: string[];
  branches?: string[];
  formCheckTypes?: string[];
}
