
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BranchService } from '../../../_services/branch.service';
import * as BranchActions from './branch.actions';

@Injectable()
export class BranchEffects {
  private actions$ = inject(Actions);
  private branchService = inject(BranchService);

  getAllBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchActions.getAllBranches),
      switchMap(({ bankId }) =>
        this.branchService.getBranches(bankId).pipe(
          map((response) => BranchActions.getAllBranchesSuccess({ branches: response.branches })),
          catchError((error) => of(BranchActions.getAllBranchesFailure({ error })))
        )
      )
    )
  );

  createBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchActions.createNewBranch),
      switchMap(({ bankId, branch }) =>
        this.branchService.addBranch(branch, bankId).pipe(
          map(() => BranchActions.getAllBranches({ bankId })),
          catchError((error) => of(BranchActions.createNewBranchFailure({ error })))
        )
      )
    )
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchActions.updateBranch),
      switchMap(({ bankId, branch }) =>
        this.branchService.updateBranch(branch, bankId).pipe(
          map(() => BranchActions.getAllBranches({ bankId })),
          catchError((error) => of(BranchActions.updateBranchFailure({ error })))
        )
      )
    )
  );

  deleteBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchActions.deleteBranch),
      switchMap(({ bankId, branchId }) =>
        this.branchService.deleteBranch(bankId, branchId).pipe(
          map(() => BranchActions.getAllBranches({ bankId })),
          catchError((error) => of(BranchActions.deleteBranchFailure({ error })))
        )
      )
    )
  );
}
