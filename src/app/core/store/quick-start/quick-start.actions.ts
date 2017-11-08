import { Action } from '@ngrx/store';
import {IRecord, IRecordInfo, ISchemaEmbedded} from '../../classes';

export const LOAD = '[Quick Start] Load';
export const LOAD_SUCCESS = '[Quick Start] Load Success';
export const LOAD_FAIL = '[Quick Start] Load Fail';

export const LOAD_MANUAL = '[Quick Start] Load manual';
export const LOAD_MANUAL_SUCCESS = '[Quick Start] Load manual Success';
export const LOAD_MANUAL_FAIL = '[Quick Start] Load manual Fail';
export const UPDATE_MANUAL_POSITION = '[Quick Start] Update manual position';

export const LOAD_DISTINCT_SUB_BATCH_SUCCESS = '[Quick Start] Load distinct sub batch success';

/**
 * Load Quick Start Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: {batch:IRecord, assessments:ISchemaEmbedded[]}) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

export class LoadManualAction implements Action {
  readonly type = LOAD_MANUAL;
}

export class LoadManualSuccessAction implements Action {
  readonly type = LOAD_MANUAL_SUCCESS;

  constructor(public payload: IRecordInfo) { }
}

export class LoadManualFailAction implements Action {
  readonly type = LOAD_MANUAL_FAIL;

  constructor(public payload: any) { }
}

export class UpdateManualPosition implements Action {
  readonly type = UPDATE_MANUAL_POSITION;

  constructor(public payload: { espaldera: number, hilera: number, posicion: number }) { }
}

export class LoadDistinctSubBatchSuccess implements Action {
  readonly type = LOAD_DISTINCT_SUB_BATCH_SUCCESS;

  constructor(public payload: number[]) { }
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | LoadManualAction
  | LoadManualSuccessAction
  | LoadManualFailAction
  | UpdateManualPosition
  | LoadDistinctSubBatchSuccess;

export const QuickStartActions = {
  LoadAction,
  LoadSuccessAction,
  LoadFailAction,
  LoadManualAction,
  LoadManualSuccessAction,
  LoadManualFailAction,
  UpdateManualPosition,
  LoadDistinctSubBatchSuccess
}