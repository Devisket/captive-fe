import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import {
  createNewBatch,
  createNewBatchFailure,
  deleteBatch,
  deleteBatchFailure,
  getAllBatches,
  getAllBatchesFailure,
  getAllBatchesSuccess,
} from './batch.actions';
import { Injectable } from '@angular/core';
import { Batch } from '../../../_models/batch';
import { BatchesService } from '../../_services/batches.service';

@Injectable()
export class BatchEffects {
  constructor(
    private actions$: Actions,
    private batchesService: BatchesService
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
}
