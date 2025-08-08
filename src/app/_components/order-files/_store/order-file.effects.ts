import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { of } from 'rxjs';
import {
  getOrderFilesFailure,
  getOrderFilesSuccess,
  getOrderFiles,
  uploadOrderFiles,
  uploadOrderFilesFailure,
  validateOrderFile,
  validateOrderFileFailure,
  processOrderFile,
  processOrderFileFailure,
  getFloatingCheckOrders,
  getFloatingCheckOrdersFailure,
  getFloatingCheckOrdersSuccess,
  createFloatingCheckOrder,
  createFloatingCheckOrderFailure,
  updateFloatingCheckOrder,
  updateFloatingCheckOrderFailure,
  deleteFloatingCheckOrder,
  deleteFloatingCheckOrderFailure,
  holdFloatingCheckOrder,
  holdFloatingCheckOrderFailure,
  releaseFloatingCheckOrder,
  releaseFloatingCheckOrderFailure,
  deleteOrderFile,
  deleteOrderFileFailure,
  processOrderFileSuccess,
  validateAllOrderFiles,
  validateAllOrderFilesError,
  processAllOrderFiles,
  processAllOrderFilesError,
  pollOrderFiles,
  pollOrderFilesSuccess,
  pollOrderFilesFailure,
} from './order-file.actions';
import { OrderFilesService } from '../../../_services/order-files.service';
import { LogDto } from '../../../_models/log-dto';
import { MessageService } from 'primeng/api';
@Injectable()
export class OrderFileEffects {
  constructor(
    private actions$: Actions,
    private orderFileService: OrderFilesService,
    private messageService: MessageService
  ) {}


  getOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrderFiles),
      switchMap((action) =>
        this.orderFileService.getOrderFiles(action.bankId, action.batchId).pipe(
          map((response) =>
            getOrderFilesSuccess({ orderFiles: response.orderFiles })
          ),
          catchError((error) => of(getOrderFilesFailure({ error })))
        )
      )
    )
  );

  uploadOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadOrderFiles),
      switchMap(({ formData, bankId, batchId }) =>
        this.orderFileService.uploadOrderFiles(formData).pipe(
          map(() => getOrderFiles({ bankId, batchId })),
          catchError((error) => of(uploadOrderFilesFailure({ error })))
        )
      )
    )
  );

  validateOrderFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateOrderFile),
      switchMap(({ orderFileId, bankId, batchId }) =>
        this.orderFileService.validateOrderFile(orderFileId).pipe(
          map(() => getOrderFiles({ bankId, batchId })),
          catchError((error) => of(validateOrderFileFailure({ error })))
        )
      )
    )
  );

  processOrderFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processOrderFile),
      switchMap(({ orderFileId, bankId, batchId }) =>
        this.orderFileService.processOrderFile(orderFileId).pipe(
          map((responseLog : LogDto) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: responseLog.logMessage,
            });
            return processOrderFileSuccess({ response: responseLog })
          }),
          map(() => getOrderFiles({ bankId, batchId })),
          catchError((error) => of(processOrderFileFailure({ error })))
        )
      )
    )
  );

  deleteOrderFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrderFile),
      switchMap(({ orderFileId, bankId, batchId }) =>
        this.orderFileService.deleteOrderFile(orderFileId).pipe(
          map(() => validateAllOrderFiles({ bankId, batchId })),
          catchError((error) => of(deleteOrderFileFailure({ error })))
        )
      )
    )
  );

  getFloatingCheckOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getFloatingCheckOrders),
      switchMap(({ orderFileId }) =>
        this.orderFileService.getFloatingCheckOrders(orderFileId).pipe(
          map((checkOrders) =>
            getFloatingCheckOrdersSuccess({ checkOrders, orderFileId })
          ),
          catchError((error) => of(getFloatingCheckOrdersFailure({ error })))
        )
      )
    )
  );

  createFloatingCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createFloatingCheckOrder),
      switchMap(({ bankId, batchId, orderFileId, checkOrders }) =>
        this.orderFileService
          .createFloatingCheckOrder(bankId, checkOrders)
          .pipe(
            map(() => validateAllOrderFiles({bankId, batchId })),
            catchError((error) =>
              of(createFloatingCheckOrderFailure({ error }))
            )
          )
      )
    )
  );

  updateFloatingCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFloatingCheckOrder),
      switchMap(({ bankId, batchId, orderFileId, checkOrders }) =>
        this.orderFileService
          .updateFloatingCheckOrder(bankId, checkOrders)
          .pipe(
            map(() => validateAllOrderFiles({ bankId, batchId })),
            catchError((error) =>
              of(updateFloatingCheckOrderFailure({ error }))
            )
          )
      )
    )
  );

  deleteFloatingCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFloatingCheckOrder),
      switchMap(({ bankId, batchId, orderFileId, checkOrderId }) =>
        this.orderFileService
          .deleteFloatingCheckOrder(bankId, checkOrderId)
          .pipe(
            map(() => validateAllOrderFiles({bankId, batchId })),
            catchError((error) =>
              of(deleteFloatingCheckOrderFailure({ error }))
            )
          )
      )
    )
  );

  holdFloatingCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(holdFloatingCheckOrder),
      switchMap(({ bankId, batchId, checkOrderId }) =>
        this.orderFileService.holdFloatingCheckOrder(bankId, checkOrderId).pipe(
          map(() => validateAllOrderFiles({bankId, batchId })),
          catchError((error) => of(holdFloatingCheckOrderFailure({ error })))
        )
      )
    )
  );

  releaseFloatingCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(releaseFloatingCheckOrder),
      switchMap(({ bankId, batchId, orderFileId, checkOrderId }) =>
        this.orderFileService
          .releaseFloatingCheckOrder(bankId, checkOrderId)
          .pipe(
            map(() => validateAllOrderFiles({ bankId, batchId })),
            catchError((error) =>
              of(releaseFloatingCheckOrderFailure({ error }))
            )
          )
      )
    )
  );

  validateAllOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateAllOrderFiles),
      switchMap(({ bankId, batchId }) =>
        this.orderFileService.validateAllOrderFiles(bankId, batchId).pipe(
          map(() => getOrderFiles({ bankId, batchId })),
          catchError((error) => of(validateAllOrderFilesError({ error })))
        )
      )
    )
  );

  processAllOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processAllOrderFiles),
      switchMap(({ bankId, batchId }) =>
        this.orderFileService.processAllOrderFiles(bankId, batchId).pipe(
          map(() => getOrderFiles({ bankId, batchId })),
          catchError((error : LogDto) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.logMessage
            });
            return of(processAllOrderFilesError({ error }));
          })
        )
      )
    )
  );

  // Polling effect - doesn't trigger loading state
  pollOrderFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pollOrderFiles),
      switchMap((action) =>
        this.orderFileService.getOrderFiles(action.bankId, action.batchId).pipe(
          map((response) =>
            pollOrderFilesSuccess({ orderFiles: response.orderFiles })
          ),
          catchError((error) => of(pollOrderFilesFailure({ error })))
        )
      )
    )
  );
}
