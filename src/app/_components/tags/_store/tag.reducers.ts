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
} from './tag.actions';
import { CheckInventory } from '../../../_models/check-inventory';

export interface TagState {
  tags: Tag[];
  selectedTag: Tag | null;
  tagMappings: TagMapping[];
  checkInventories: CheckInventory[];
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  selectedTag: null,
  tagMappings: [],
  checkInventories: [],
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
    on(getCheckInventorySuccess, (state, { checkInventory }) => ({
      ...state,
      checkInventories: checkInventory,
    })),
    on(getCheckInventoryFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(addNewCheckInventoryFailure, (state, { error }) => ({
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
