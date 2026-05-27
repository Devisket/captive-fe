
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  getAllBatches,
  getAllBatchesFailure,
  getAllBatchesSuccess,
  createNewBatchFailure,
  deleteBatchFailure,
  processBatch,
  processBatchSuccess,
  processBatchFailure,
  pollBatchJobSuccess,
  pollBatchJobFailure,
  confirmBatchProcess,
  confirmBatchProcessSuccess,
  confirmBatchProcessFailure,
  clearBatchJob,
  pollBatchOrderFilesSuccess,
  pollBatchOrderFilesFailure,
  updateOrderFileDetailForBatch,
} from './batch.actions';
import { Batch } from '../../../_models/batch';
import { BatchJob } from '../../../_models/batch-job';
import { OrderFile } from '../../../_models/order-file';

export interface BatchState {
  batches: Batch[];
  loading: boolean;
  error: any;
  // job tracking keyed by batchId
  jobs: Record<string, BatchJob>;
  processingBatchId: string | null;
  // order files per batch for real-time status display, keyed by batchId
  orderFilesByBatch: Record<string, OrderFile[]>;
}

export const initialState: BatchState = {
  batches: [],
  loading: false,
  error: null,
  jobs: {},
  processingBatchId: null,
  orderFilesByBatch: {},
};

export const batchReducer = createReducer(
  initialState,
  on(getAllBatches, (state) => ({ ...state, loading: true })),
  on(getAllBatchesSuccess, (state, { batches }) => ({
    ...state,
    batches,
    loading: false,
  })),
  on(getAllBatchesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createNewBatchFailure, (state, { error }) => ({ ...state, error })),
  on(deleteBatchFailure, (state, { error }) => ({ ...state, error })),

  // Process batch
  on(processBatch, (state, { batchId }) => ({
    ...state,
    processingBatchId: batchId,
  })),
  on(processBatchSuccess, (state, { jobId, batchId }) => ({
    ...state,
    processingBatchId: batchId,
    jobs: {
      ...state.jobs,
      [batchId]: {
        jobId,
        status: 'Pending' as const,
        progress: 0,
        currentStep: null,
        warnings: [],
        errorMessage: null,
      },
    },
  })),
  on(processBatchFailure, (state, { error }) => ({
    ...state,
    error,
    processingBatchId: null,
  })),

  // Poll job
  on(pollBatchJobSuccess, (state, { job, batchId }) => ({
    ...state,
    jobs: { ...state.jobs, [batchId]: job },
    processingBatchId:
      job.status === 'Completed' || job.status === 'Failed'
        ? null
        : state.processingBatchId,
  })),
  on(pollBatchJobFailure, (state, { error }) => ({ ...state, error })),

  // Confirm
  on(confirmBatchProcess, (state) => ({ ...state })),
  on(confirmBatchProcessSuccess, (state, { jobId, batchId }) => ({
    ...state,
    processingBatchId: batchId,
    jobs: {
      ...state.jobs,
      [batchId]: {
        jobId,
        status: 'Pending' as const,
        progress: 0,
        currentStep: null,
        warnings: [],
        errorMessage: null,
      },
    },
  })),
  on(confirmBatchProcessFailure, (state, { error }) => ({ ...state, error })),

  // Clear
  on(clearBatchJob, (state, { batchId }) => {
    const { [batchId]: _, ...jobs } = state.jobs;
    const { [batchId]: __, ...orderFilesByBatch } = state.orderFilesByBatch;
    return { ...state, jobs, orderFilesByBatch, processingBatchId: null };
  }),

  // Per-batch order file tracking
  on(pollBatchOrderFilesSuccess, (state, { batchId, orderFiles }) => ({
    ...state,
    orderFilesByBatch: { ...state.orderFilesByBatch, [batchId]: orderFiles },
  })),
  on(pollBatchOrderFilesFailure, (state, { error }) => ({ ...state, error })),
  on(updateOrderFileDetailForBatch, (state, { batchId, orderFile }) => {
    const existing = state.orderFilesByBatch[batchId] ?? [];
    const updated = existing.map(f => f.id === orderFile.id ? { ...f, statusDetail: orderFile.statusDetail, status: orderFile.status } : f);
    const merged = updated.some(f => f.id === orderFile.id) ? updated : [...existing, orderFile];
    return { ...state, orderFilesByBatch: { ...state.orderFilesByBatch, [batchId]: merged } };
  })
);

export const BatchFeature = createFeature({
  name: 'batch',
  reducer: batchReducer,
});
