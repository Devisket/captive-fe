import { createAction, props } from "@ngrx/store";
import { Batch } from "../../../_models/batch";
import { BatchJob } from "../../../_models/batch-job";
import { OrderFile } from "../../../_models/order-file";


export const getAllBatches = createAction('[Batch] Get All Batches', props<{ bankId: string }>());

export const getAllBatchesSuccess = createAction('[Batch] Get All Batches Success', props<{ batches: Batch[] }>());

export const getAllBatchesFailure = createAction('[Batch] Get All Batches Failure', props<{ error: any }>());

export const createNewBatch = createAction('[Batch] Create New Batch', props<{ bankId: string, date:string, batchName:string | null }>());

export const createNewBatchFailure = createAction('[Batch] Create New Batch Failure', props<{ error: any }>());

export const deleteBatch = createAction('[Batch] Delete Batch', props<{ bankId: string, batchId: string }>());

export const deleteBatchFailure = createAction('[Batch] Delete Batch Failure', props<{ error: any }>());

// Async batch processing
export const processBatch = createAction('[Batch] Process Batch', props<{ bankId: string, batchId: string }>());
export const processBatchSuccess = createAction('[Batch] Process Batch Success', props<{ jobId: string, batchId: string }>());
export const processBatchFailure = createAction('[Batch] Process Batch Failure', props<{ error: any }>());

export const pollBatchJob = createAction('[Batch] Poll Batch Job', props<{ bankId: string, batchId: string }>());
export const pollBatchJobSuccess = createAction('[Batch] Poll Batch Job Success', props<{ job: BatchJob, batchId: string }>());
export const pollBatchJobFailure = createAction('[Batch] Poll Batch Job Failure', props<{ error: any }>());

export const confirmBatchProcess = createAction('[Batch] Confirm Batch Process', props<{ bankId: string, batchId: string }>());
export const confirmBatchProcessSuccess = createAction('[Batch] Confirm Batch Process Success', props<{ jobId: string, batchId: string }>());
export const confirmBatchProcessFailure = createAction('[Batch] Confirm Batch Process Failure', props<{ error: any }>());

export const clearBatchJob = createAction('[Batch] Clear Batch Job', props<{ batchId: string }>());

// Per-batch order file tracking
export const pollBatchOrderFiles = createAction('[Batch] Poll Order Files', props<{ bankId: string; batchId: string }>());
export const pollBatchOrderFilesSuccess = createAction('[Batch] Poll Order Files Success', props<{ batchId: string; orderFiles: OrderFile[] }>());
export const pollBatchOrderFilesFailure = createAction('[Batch] Poll Order Files Failure', props<{ error: any }>());
export const updateOrderFileDetailForBatch = createAction('[Batch] Update Order File Detail', props<{ batchId: string; orderFile: OrderFile }>());




