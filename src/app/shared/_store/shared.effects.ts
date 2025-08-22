import { Actions } from "@ngrx/effects";
import { ofType } from "@ngrx/effects";
import { createEffect } from "@ngrx/effects";
import { getBankValues, getBankValuesFailure, getBankValuesSuccess } from "./shared.actions";
import { SharedService } from "../../core/_services/shared.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { BankValues } from "../../_models/values/bankValues";
import { Injectable } from "@angular/core";

@Injectable()
export class SharedEffects {
    constructor(private actions$: Actions, private sharedService: SharedService) {}

    getBankValues$ = createEffect(() => this.actions$.pipe(
        ofType(getBankValues),
        mergeMap((action) => this.sharedService.getBankValues(action.bankId).pipe(
            map((bankValues: BankValues) => getBankValuesSuccess({ bankValues })),
            catchError((error) => of(getBankValuesFailure({ error })))
        ))
    ));
}
