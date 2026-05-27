import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, exhaustMap } from 'rxjs';
import {
  createNewBatch,
  createNewBatchFailure,
  deleteBatch,
  deleteBatchFailure,
  getAllBatches,
  getAllBatchesFailure,
  getAllBatchesSuccess,
  processBatch,
  processBatchSuccess,
  processBatchFailure,
  pollBatchJob,
  pollBatchJobSuccess,
  pollBatchJobFailure,
  confirmBatchProcess,
  confirmBatchProcessSuccess,
  confirmBatchProcessFailure,
  cancelBatchProcess,
  cancelBatchProcessFailure,
  clearBatchJob,
  pollBatchOrderFiles,
  pollBatchOrderFilesSuccess,
  pollBatchOrderFilesFailure,
} from './batch.actions';
import { Injectable } from '@angular/core';
import { Batch } from '../../../_models/batch';
import { BatchesService } from '../../_services/batches.service';
import { OrderFilesService } from '../../_services/order-files.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class BatchEffects {
  constructor(
    private actions$: Actions,
    private batchesService: BatchesService,
    private orderFilesService: OrderFilesService,
    private messageService: MessageService
  ) {}

  getAllBatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAllBatches),
      mergeMap(({ bankId }) =>
        this.batchesService.getBatches(bankId).pipe(
          map((batches: Batch[]) => getAllBatchesSuccess({ batches })),
          catchError((error) => of(getAllBatchesFailure({ error })))
        )
      )
    )
  );

  createNewBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createNewBatch),
      mergeMap(({ bankId, date, batchName}) =>
        this.batchesService.addBatch(bankId, date, batchName).pipe(
          map(() => getAllBatches({ bankId })),
          catchError((error) => of(createNewBatchFailure({ error })))
        )
      )
    )
  );

  deleteBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBatch),
      mergeMap(({ bankId, batchId }) =>
        this.batchesService.deleteBatch(bankId, batchId).pipe(
          map(() => getAllBatches({ bankId })),
          catchError((error) => of(deleteBatchFailure({ error })))
        )
      )
    )
  );

  processBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processBatch),
      exhaustMap(({ bankId, batchId }) =>
        this.batchesService.processBatch(bankId, batchId).pipe(
          map(({ jobId }) => processBatchSuccess({ jobId, batchId })),
          catchError((error) => of(processBatchFailure({ error })))
        )
      )
    )
  );

  pollBatchJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pollBatchJob),
      switchMap(({ bankId, batchId }) =>
        this.batchesService.getBatchJobStatus(bankId, batchId).pipe(
          map((job) => pollBatchJobSuccess({ job, batchId })),
          catchError((error) => of(pollBatchJobFailure({ error })))
        )
      )
    )
  );

  jobFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pollBatchJobSuccess),
      switchMap(({ job }) => {
        if (job.status === 'Failed') {
          this.messageService.add({
            severity: 'error',
            summary: 'Batch Processing Failed',
            detail: job.errorMessage ?? 'An error occurred during batch processing.',
          });
        }
        if (job.status === 'Completed') {
          this.messageService.add({
            severity: 'success',
            summary: 'Batch Processed',
            detail: 'Batch processing completed successfully.',
          });
        }
        return of();
      })
    ),
    { dispatch: false }
  );

  confirmBatchProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmBatchProcess),
      exhaustMap(({ bankId, batchId }) =>
        this.batchesService.confirmBatchProcess(bankId, batchId).pipe(
          map(({ jobId }) => confirmBatchProcessSuccess({ jobId, batchId })),
          catchError((error) => of(confirmBatchProcessFailure({ error })))
        )
      )
    )
  );

  cancelBatchProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelBatchProcess),
      exhaustMap(({ bankId, batchId }) =>
        this.batchesService.cancelBatchProcess(bankId, batchId).pipe(
          map(() => clearBatchJob({ batchId })),
          catchError((error) => of(cancelBatchProcessFailure({ error })))
        )
      )
    )
  );

  pollBatchOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pollBatchOrderFiles),
      switchMap(({ bankId, batchId }) =>
        this.orderFilesService.getOrderFiles(bankId, batchId).pipe(
          map((response) => pollBatchOrderFilesSuccess({ batchId, orderFiles: response.orderFiles ?? [] })),
          catchError((error) => of(pollBatchOrderFilesFailure({ error })))
        )
      )
    )
  );
}
