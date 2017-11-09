import { Action } from '@ngrx/store';
import { IRecord, ISchemaEmbedded } from '../../classes';
export const LOAD = '[Assessment Query] Load';
export const LOAD_SUCCESS = '[Assessment Query] Load Success';
export const LOAD_FAIL = '[Assessment Query] Load Fail';

export const SAVE = '[Assessment Query] Save';
export const SAVE_SUCCESS = '[Assessment Query] Save Success';
export const SAVE_FAIL = '[Assessment Query] Save Fail';

/**
 * Load Assessment Query Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
  constructor(public payload: any) { }
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: { record: IRecord, schema: ISchemaEmbedded, referenceId: string, allow: boolean, rerference?:IRecord }) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

export class SaveAction implements Action {
  readonly type = SAVE;
  constructor(public payload: IRecord) { }
}

export class SaveSuccessAction implements Action {
  readonly type = SAVE_SUCCESS;
}

export class SaveFailAction implements Action {
  readonly type = SAVE_FAIL;

  constructor(public payload: any) { }
}
export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | SaveAction
  | SaveSuccessAction
  | SaveFailAction;

export const AssessmentQueryActions = {
  LoadAction, LoadSuccessAction, LoadFailAction, SaveAction, SaveSuccessAction, SaveFailAction
}