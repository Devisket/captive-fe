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
} from './tag.actions';
import { CheckInventory } from '../../../_models/check-inventory';

export interface TagState {
  tags: Tag[];
  selectedTag: TagDetailState;
}

export interface TagDetailState {
  tag: Tag | undefined;
  tagMapping?: TagMapping[];
  checkInventory?: CheckInventory[];
}

export const initialState: TagState = {
  tags: [],
  selectedTag: {
    tag: undefined,
    tagMapping: [],
    checkInventory: [],
  },
};

export const tagReducer = createReducer(
  initialState,
  on(getTagsSuccess, (state, { tags }) => ({ ...state, tags })),
  on(getTagsFailure, (state, { error }) => ({ ...state, error })),
  on(getTagMappingSuccess, (state, { tagMapping }) => ({
    ...state,
    selectedTag: { ...state.selectedTag, tagMapping },
  })),
  on(getTagMappingFailure, (state, { error }) => ({ ...state, error })),
  on(getCheckInventorySuccess, (state, { checkInventory }) => ({
    ...state,
    selectedTag: { ...state.selectedTag, checkInventory },
  })),
  on(getCheckInventoryFailure, (state, { error }) => ({ ...state, error })),
  on(setSelectedTag, (state, { tag }) => ({ ...state, selectedTag: { tag } }))
);

export const TagFeature = createFeature({
  name: 'tag',
  reducer: tagReducer,
});
