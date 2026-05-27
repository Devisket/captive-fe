import { createAction, props } from "@ngrx/store";
import { CheckInventory, CheckInventoryQueryRequest, CheckInventoryResponse } from "../../../_models/check-inventory";

export const getCheckInventory = createAction('[CheckInventory] Get Check Inventory', props<{ query: CheckInventoryQueryRequest }>());
export const getCheckInventorySuccess = createAction('[CheckInventory] Get Check Inventory Success', props<{ checkInventoryResponse: CheckInventoryResponse }>());
export const getCheckInventoryFailure = createAction('[CheckInventory] Get Check Inventory Failure', props<{ error: string }>());

export const addNewCheckInventory = createAction('[CheckInventory] Add New Check Inventory', props<{ bankId: string, checkInventory: CheckInventory }>());
export const addNewCheckInventoryFailure = createAction('[CheckInventory] Add New Check Inventory Failure', props<{ error: string }>());

export const updateCheckInventory = createAction('[CheckInventory] Update Check Inventory', props<{ bankId: string, checkInventory: CheckInventory }>());
export const updateCheckInventoryFailure = createAction('[CheckInventory] Update Check Inventory Failure', props<{ error: string }>());

export const deleteCheckInventory = createAction('[CheckInventory] Delete Check Inventory', props<{ bankId: string, checkInventoryId: string }>());
export const deleteCheckInventoryFailure = createAction('[CheckInventory] Delete Check Inventory Failure', props<{ error: string }>());

export const setCheckInventoryActive = createAction('[CheckInventory] Set Check Inventory Active', props<{ bankId: string, checkInventoryId: string }>());
export const setCheckInventoryActiveFailure = createAction('[CheckInventory] Set Check Inventory Active Failure', props<{ error: string }>());
