import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TagsService } from '../../../_services/tags.service';
import {
  getTagMapping,
  getTags,
  getTagMappingSuccess,
  getTagMappingFailure,
  getTagsSuccess,
  getTagsFailure,
  getCheckInventory,
  getCheckInventoryFailure,
  getCheckInventorySuccess,
  addNewTag,
  addNewTagFailure,
  updateTag,
  updateTagFailure,
  deleteTag,
  deleteTagFailure,
  addNewTagMapping,
  addNewTagMappingFailure,
  updateTagMapping,
  updateTagMappingFailure,
  deleteTagMapping,
  deleteTagMappingFailure,
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

  getAllTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTags),
      switchMap(({ bankInfoId }) =>
        this.tagsService.getAllTags(bankInfoId).pipe(
          map((tags) => getTagsSuccess({ tags })),
          catchError((error) => of(getTagsFailure({ error })))
        )
      )
    )
  );

  getTagMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTagMapping),
      switchMap(({ bankInfoId, tagId }) =>
        this.tagsService.getTagMapping(bankInfoId, tagId).pipe(
          map((tagMapping) => getTagMappingSuccess({ tagMapping })),
          catchError((error) => of(getTagMappingFailure({ error })))
        )
      )
    )
  );

  getCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCheckInventory),
      switchMap(({ tagId }) =>
        this.tagsService.getCheckInventory(tagId).pipe(
          map((checkInventory) => getCheckInventorySuccess({ checkInventory })),
          catchError((error) => of(getCheckInventoryFailure({ error })))
        )
      )
    )
  );

  addNewTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewTag),
      switchMap(({ bankInfoId, tag }) =>
        this.tagsService.addNewtag(bankInfoId, tag).pipe(
          map(() => getTags({ bankInfoId })),
          catchError((error) => of(addNewTagFailure({ error })))
        )
      )
    )
  );

  updateTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTag),
      switchMap(({ bankInfoId, tagId, tag }) =>
        this.tagsService.updateTag(bankInfoId, tagId, tag).pipe(
          map(() => getTags({ bankInfoId })),
          catchError((error) => of(updateTagFailure({ error })))
        )
      )
    )
  );

  deleteTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTag),
      switchMap(({ bankInfoId, tagId }) =>
        this.tagsService.deleteTag(bankInfoId, tagId).pipe(
          map(() => getTags({ bankInfoId })),
          catchError((error) => of(deleteTagFailure({ error })))
        )
      )
    )
  );

  addNewTagMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewTagMapping),
      switchMap(({ bankInfoId, tagId, tagMappings }) =>
        this.tagsService.addNewTagMapping(bankInfoId, tagId, tagMappings).pipe(
          map(() => getTagMapping({ bankInfoId, tagId })),
          catchError((error) => of(addNewTagMappingFailure({ error })))
        )
      )
    )
  );

  updateTagMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTagMapping),
      switchMap(({ bankInfoId, tagId, tagMappingId, tagMappings }) =>
        this.tagsService
          .updateTagMapping(bankInfoId, tagId, tagMappingId, tagMappings)
          .pipe(
            map(() => getTagMapping({ bankInfoId, tagId })),
            catchError((error) => of(updateTagMappingFailure({ error })))
          )
      )
    )
  );

  deleteTagMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTagMapping),
      switchMap(({ bankInfoId, tagId, tagMappingId }) =>
        this.tagsService.deleteTagMapping(bankInfoId, tagId, tagMappingId).pipe(
          map(() => getTagMapping({ bankInfoId, tagId })),
          catchError((error) => of(deleteTagMappingFailure({ error })))
        )
      )
    )
  );

  addNewCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewCheckInventory),
      switchMap(({ tagId, checkInventory }) =>
        this.tagsService.createCheckInventory(checkInventory).pipe(
          map(() => getCheckInventory({ tagId })),
          catchError((error) => of(addNewCheckInventoryFailure({ error })))
        )
      )
    )
  );

  updateCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCheckInventory),
      switchMap(({ tagId, checkInventory }) =>
        this.tagsService.updateCheckInventory(checkInventory).pipe(
          map(() => getCheckInventory({ tagId })),
          catchError((error) => of(updateCheckInventoryFailure({ error })))
        )
      )
    )
  );

  deleteCheckInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCheckInventory),
      switchMap(({ tagId, checkInventoryId }) =>
        this.tagsService.deleteCheckInventory(checkInventoryId).pipe(
          map(() => getCheckInventory({ tagId })),
          catchError((error) => of(deleteCheckInventoryFailure({ error })))
        )
      )
    )
  );

  setCheckInventoryActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCheckInventoryActive),
      switchMap(({ checkInventoryId, tagId }) =>
        this.tagsService.setCheckInventoryActive(checkInventoryId).pipe(
          map(() => getCheckInventory({ tagId })),
          catchError((error) => of(setCheckInventoryActiveFailure({ error })))
        )
      )
    )
  );
}
