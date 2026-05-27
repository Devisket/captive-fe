import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TagsService } from '../../_services/tags.service';
import {
  getCheckInventory,
  getCheckInventoryFailure,
  getCheckInventorySuccess,
  addNewCheckInventory,
  addNewCheckInventoryFailure,
  updateCheckInventory,
  updateCheckInventoryFailure,
  deleteCheckInventory,
  deleteCheckInventoryFailure,
  setCheckInventoryActiveFailure,
  setCheckInventoryActive,
} from './tag.actions';
import { of } from 'rxjs';
import { map } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class TagEffects {
  constructor(private actions$: Actions, private tagsService: TagsService) {}

  getCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCheckInventory),
      switchMap(({ query }) =>
        this.tagsService.getCheckInventory(query).pipe(
          map((checkInventoryResponse) => getCheckInventorySuccess({ checkInventoryResponse })),
          catchError((error) => of(getCheckInventoryFailure({ error })))
        )
      )
    )
  );

  addNewCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewCheckInventory),
      switchMap(({ bankId, checkInventory }) =>
        this.tagsService.createCheckInventory(checkInventory).pipe(
          map(() => getCheckInventory({ query: { bankId, currentPage: 1, pageSize: 10 } })),
          catchError((error) => of(addNewCheckInventoryFailure({ error })))
        )
      )
    )
  );

  updateCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCheckInventory),
      switchMap(({ bankId, checkInventory }) =>
        this.tagsService.updateCheckInventory(checkInventory).pipe(
          map(() => getCheckInventory({ query: { bankId, currentPage: 1, pageSize: 10 } })),
          catchError((error) => of(updateCheckInventoryFailure({ error })))
        )
      )
    )
  );

  deleteCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCheckInventory),
      switchMap(({ bankId, checkInventoryId }) =>
        this.tagsService.deleteCheckInventory(checkInventoryId).pipe(
          map(() => getCheckInventory({ query: { bankId, currentPage: 1, pageSize: 10 } })),
          catchError((error) => of(deleteCheckInventoryFailure({ error })))
        )
      )
    )
  );

  setCheckInventoryActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCheckInventoryActive),
      switchMap(({ checkInventoryId, bankId }) =>
        this.tagsService.setCheckInventoryActive(checkInventoryId).pipe(
          map(() => getCheckInventory({ query: { bankId, currentPage: 1, pageSize: 10 } })),
          catchError((error) => of(setCheckInventoryActiveFailure({ error })))
        )
      )
    )
  );
}
