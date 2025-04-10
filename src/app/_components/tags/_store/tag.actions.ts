import { createAction, props } from "@ngrx/store";
import { Tag } from "../../../_models/tag";
import { CheckInventory } from "../../../_models/check-inventory";
import { TagMapping } from "../../../_models/tag-mapping";


export const getTags = createAction('[Tags] Get Tags', props<{ bankInfoId: string }>());
export const getTagsSuccess = createAction('[Tags] Get Tags Success', props<{ tags: Tag[] }>());
export const getTagsFailure = createAction('[Tags] Get Tags Failure', props<{ error: string }>());

export const setSelectedTag = createAction('[Tags] Set Selected Tag', props<{ tag: Tag }>());

export const getTagMapping = createAction('[Tags] Get Tag Mapping', props<{ bankInfoId: string, tagId: string }>());
export const getTagMappingSuccess = createAction('[Tags] Get Tag Mapping Success', props<{ tagMapping: TagMapping[] }>());
export const getTagMappingFailure = createAction('[Tags] Get Tag Mapping Failure', props<{ error: string }>());

export const getCheckInventory = createAction('[Tags] Get Check Inventory', props<{ tagId: string }>());
export const getCheckInventorySuccess = createAction('[Tags] Get Check Inventory Success', props<{ checkInventory: CheckInventory[] }>());
export const getCheckInventoryFailure = createAction('[Tags] Get Check Inventory Failure', props<{ error: string }>());

export const addNewTag = createAction('[Tags] Add New Tag', props<{ bankInfoId: string, tag: Tag }>());
export const addNewTagFailure = createAction('[Tags] Add New Tag Failure', props<{ error: string }>());

export const updateTag = createAction('[Tags] Update Tag', props<{ bankInfoId: string, tagId: string, tag: Tag }>());
export const updateTagFailure = createAction('[Tags] Update Tag Failure', props<{ error: string }>());

export const deleteTag = createAction('[Tags] Delete Tag', props<{ bankInfoId: string, tagId: string }>());
export const deleteTagFailure = createAction('[Tags] Delete Tag Failure', props<{ error: string }>());

export const addNewTagMapping = createAction('[Tags] Add New Tag Mapping', props<{ bankInfoId: string, tagId: string, tagMappings: TagMapping[] }>());
export const addNewTagMappingFailure = createAction('[Tags] Add New Tag Mapping Failure', props<{ error: string }>());

export const updateTagMapping = createAction('[Tags] Update Tag Mapping', props<{ bankInfoId: string, tagId: string, tagMappingId: string, tagMappings: TagMapping[] }>());
export const updateTagMappingFailure = createAction('[Tags] Update Tag Mapping Failure', props<{ error: string }>());

export const deleteTagMapping = createAction('[Tags] Delete Tag Mapping', props<{ bankInfoId: string, tagId: string, tagMappingId: string }>());
export const deleteTagMappingFailure = createAction('[Tags] Delete Tag Mapping Failure', props<{ error: string }>());

export const addNewCheckInventory = createAction('[Tags] Add New Check Inventory', props<{ tagId: string, checkInventory: CheckInventory }>());
export const addNewCheckInventoryFailure = createAction('[Tags] Add New Check Inventory Failure', props<{ error: string }>());

export const updateCheckInventory = createAction('[Tags] Update Check Inventory', props<{ tagId: string, checkInventory: CheckInventory }>());
export const updateCheckInventoryFailure = createAction('[Tags] Update Check Inventory Failure', props<{ error: string }>());

export const deleteCheckInventory = createAction('[Tags] Delete Check Inventory', props<{ tagId: string, checkInventoryId: string }>());
export const deleteCheckInventoryFailure = createAction('[Tags] Delete Check Inventory Failure', props<{ error: string }>());

export const setCheckInventoryActive = createAction('[Tags] Set Check Inventory Active', props<{ tagId: string, checkInventoryId: string }>());
export const setCheckInventoryActiveFailure = createAction('[Tags] Set Check Inventory Active Failure', props<{ error: string }>());




















