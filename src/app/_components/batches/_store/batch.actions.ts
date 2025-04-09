import { createAction, props } from "@ngrx/store";
import { Batch } from "../../../_models/batch";


export const getAllBatches = createAction('[Batch] Get All Batches', props<{ bankId: string }>());

export const getAllBatchesSuccess = createAction('[Batch] Get All Batches Success', props<{ batches: Batch[] }>());

export const getAllBatchesFailure = createAction('[Batch] Get All Batches Failure', props<{ error: any }>());

export const createNewBatch = createAction('[Batch] Create New Batch', props<{ bankId: string }>());

export const createNewBatchFailure = createAction('[Batch] Create New Batch Failure', props<{ error: any }>());

export const deleteBatch = createAction('[Batch] Delete Batch', props<{ bankId: string, batchId: string }>());

export const deleteBatchFailure = createAction('[Batch] Delete Batch Failure', props<{ error: any }>());




