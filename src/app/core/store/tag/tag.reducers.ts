import { createFeature, createReducer, on } from '@ngrx/store';
import { Tag } from '../../../_models/tag';
import { TagMapping } from '../../../_models/tag-mapping';
import {
  getTagMappingFailure,
  getTagMappingSuccess,
  getTagsFailure,
  getTagsSuccess,
  getCheckInventoryFailure,
  getCheckInventorySuccess,
  setSelectedTag,
  addNewCheckInventoryFailure,
  updateCheckInventoryFailure,
  deleteCheckInventoryFailure,
  initiateCheckInventoryFailure,
} from './tag.actions';
import { CheckInventory } from '../../../_models/check-inventory';

export interface TagState {
  tags: Tag[];
  selectedTag: Tag | null;
  tagMappings: TagMapping[];
  checkInventories: CheckInventory[];
  totalRecords: number;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  selectedTag: null,
  tagMappings: [],
  checkInventories: [],
  totalRecords: 0,
  error: null,
};

export const TagFeature = createFeature({
  name: 'tag',
  reducer: createReducer(
    initialState,
    on(getTagsSuccess, (state, { tags }) => ({
      ...state,
      tags,
    })),
    on(getTagsFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(setSelectedTag, (state, { tag }) => ({
      ...state,
      selectedTag: tag,
    })),
    on(getTagMappingSuccess, (state, { tagMapping }) => ({
      ...state,
      tagMappings: tagMapping,
    })),
    on(getTagMappingFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(getCheckInventorySuccess, (state, { checkInventoryResponse }) => ({
      ...state,
      checkInventories: checkInventoryResponse.checkInventories,
      totalRecords: checkInventoryResponse.totalCount,
    })),
    on(getCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(addNewCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(initiateCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(updateCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(deleteCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
});
