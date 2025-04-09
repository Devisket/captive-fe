import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import {
  createFormCheck,
  createFormCheckFailure,
  deleteFormCheck,
  deleteFormCheckFailure,
  getAllFormChecks,
  getAllFormChecksFailure,
  getAllFormChecksSuccess,
  updateFormCheck,
  updateFormCheckFailure,
} from './formchecks.action';
import { FormChecksService } from '../../../../_services/form-check.service';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
@Injectable()
export class FormChecksEffects {
  constructor(
    private actions$: Actions,
    private formChecksService: FormChecksService,
    private store: Store
  ) {}

  getAllFormChecks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAllFormChecks),
      mergeMap(({ productId }) =>
        this.formChecksService.getAllFormChecks(productId).pipe(
          map((formChecks) => getAllFormChecksSuccess({ formChecks })),
          catchError((error) => of(getAllFormChecksFailure({ error })))
        )
      )
    )
  );

  createFormChecks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createFormCheck),
      mergeMap(({ productId, formCheck }) =>
        this.formChecksService.addFormCheck(formCheck, productId).pipe(
          map(() => getAllFormChecks({ productId })),
          catchError((error) => of(createFormCheckFailure({ error })))
        )
      )
    )
  );

  updateFormCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFormCheck),
      mergeMap(({ productId, formCheck }) =>
        this.formChecksService.updateFormCheck(formCheck, productId).pipe(
          map(() => getAllFormChecks({ productId })),
          catchError((error) => of(updateFormCheckFailure({ error })))
        )
      )
    )
  );

  deleteFormCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFormCheck),
      mergeMap(({ productId, formCheckId }) =>
        this.formChecksService.deleteFormCheck(productId, formCheckId).pipe(
          map(() => getAllFormChecks({ productId })),
          catchError((error) => of(deleteFormCheckFailure({ error })))
        )
      )
    )
  );
}
