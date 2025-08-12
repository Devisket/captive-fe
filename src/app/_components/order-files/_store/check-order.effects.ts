import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { CheckOrderService } from '../../../_services/check-order.service';
import { validateAllOrderFiles } from './order-file.actions';
import {
  saveCheckOrder,
  saveCheckOrderSuccess,
  saveCheckOrderFailure
} from './check-order.actions';

@Injectable()
export class CheckOrderEffects {
  constructor(
    private actions$: Actions,
    private checkOrderService: CheckOrderService
  ) {}

  saveCheckOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveCheckOrder),
      switchMap(({ checkOrder, bankId, batchId, orderFileId }) =>
        this.checkOrderService.saveCheckOrder(bankId,orderFileId, checkOrder).pipe(
          map((response) => {
            return validateAllOrderFiles({ bankId, batchId });
          }),
          catchError((error) => of(saveCheckOrderFailure({ error })))
        )
      )
    )
  );
}