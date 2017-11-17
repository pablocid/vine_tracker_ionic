import { Action } from '@ngrx/store';

export const LOAD = '[Synchronizator] Load';
export const LOAD_SUCCESS = '[Synchronizator] Load Success';
export const LOAD_FAIL = '[Synchronizator] Load Fail';

export const CHECK_SCHM = '[Synchronizator] Check Schemas';
export const CHECK_SCHM_SUCCESS = '[Synchronizator] Check Schemas Success';
export const CHECK_SCHM_FAIL = '[Synchronizator] Check Schemas Fail';

export const SYNC_SCHM = '[Synchronizator] Sync Schemas';
export const SYNC_SCHM_SUCCESS = '[Synchronizator] Sync Schemas Success';
export const SYNC_SCHM_FAIL = '[Synchronizator] Sync Schemas Fail';

export const CHECK_BATCH = '[Synchronizator] Check Batches';
export const CHECK_BATCH_SUCCESS = '[Synchronizator] Check Batches Success';
export const CHECK_BATCH_FAIL = '[Synchronizator] Check Batches Fail';

export const SYNC_BATCH = '[Synchronizator] Sync Batches';
export const SYNC_BATCH_SUCCESS = '[Synchronizator] Sync Batches Success';
export const SYNC_BATCH_FAIL = '[Synchronizator] Sync Batches Fail';

export const CHECK_SCHM_AND_BATCH = '[Synchronizator] Check Schemas and Batches';
export const CHECK_SCHM_AND_BATCH_SUCCESS = '[Synchronizator] Check Schemas and Batches Success';
export const CHECK_SCHM_AND_BATCH_FAIL = '[Synchronizator] Check Schemas and Batches Fail';
/**
 * Load Synchronizator Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

export class CheckSchmAction implements Action {
  readonly type = CHECK_SCHM;
}

export class CheckSchmSuccessAction implements Action {
  readonly type = CHECK_SCHM_SUCCESS;

  constructor(public payload: boolean) { }
}

export class CheckSchmFailAction implements Action {
  readonly type = CHECK_SCHM_FAIL;

  constructor(public payload: any) { }
}

export class SyncSchmAction implements Action {
  readonly type = SYNC_SCHM;
}

export class SyncSchmSuccessAction implements Action {
  readonly type = SYNC_SCHM_SUCCESS;

  constructor(public payload: boolean) { }
}

export class SyncSchmFailAction implements Action {
  readonly type = SYNC_SCHM_FAIL;

  constructor(public payload: any) { }
}

export class CheckBatchesAction implements Action {
  readonly type = CHECK_BATCH;
}

export class CheckBatchesSuccessAction implements Action {
  readonly type = CHECK_BATCH_SUCCESS;

  constructor(public payload: boolean) { }
}

export class CheckBatchesFailAction implements Action {
  readonly type = CHECK_BATCH_FAIL;

  constructor(public payload: any) { }
}

export class SyncBatchAction implements Action {
  readonly type = SYNC_BATCH;
}

export class SyncBatchSuccessAction implements Action {
  readonly type = SYNC_BATCH_SUCCESS;

  constructor(public payload: boolean) { }
}

export class SyncBatchFailAction implements Action {
  readonly type = SYNC_BATCH_FAIL;

  constructor(public payload: any) { }
}

export class CheckSchmAndBatchAction implements Action {
  readonly type = CHECK_SCHM_AND_BATCH;
  constructor() { }
}

export class CheckSchmAndBatchSuccessAction implements Action {
  readonly type = CHECK_SCHM_AND_BATCH_SUCCESS;

  constructor( public payload: {schm:boolean, batch:boolean}) { }
}

export class CheckSchmAndBatchFailAction implements Action {
  readonly type = CHECK_SCHM_AND_BATCH_FAIL;

  constructor( public payload: any) { }
}
export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | CheckSchmAction
  | CheckSchmSuccessAction
  | CheckSchmFailAction
  | SyncSchmAction
  | SyncSchmSuccessAction
  | SyncSchmFailAction
  | CheckBatchesAction
  | CheckBatchesSuccessAction
  | CheckBatchesFailAction
  | SyncBatchAction
  | SyncBatchSuccessAction
  | SyncBatchFailAction
  | CheckSchmAndBatchAction
  | CheckSchmAndBatchSuccessAction
  | CheckSchmAndBatchFailAction;

export const SyncActions = {
  LoadAction,
  LoadSuccessAction,
  LoadFailAction,
  CheckSchmAction,
  CheckSchmSuccessAction,
  CheckSchmFailAction,
  SyncSchmAction,
  SyncSchmSuccessAction,
  SyncSchmFailAction,
  SyncBatchAction,
  SyncBatchSuccessAction,
  SyncBatchFailAction,
  CheckBatchesAction,
  CheckBatchesSuccessAction,
  CheckBatchesFailAction,
  CheckSchmAndBatchAction,
  CheckSchmAndBatchSuccessAction,
  CheckSchmAndBatchFailAction
}