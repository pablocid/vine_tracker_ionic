import { Action } from '@ngrx/store';
import { IAttribute, ISchemaEmbedded, IRecord } from '../../classes';

export const LOAD = '[Assessment] Load';
export const LOAD_SUCCESS = '[Assessment] Load Success';
export const LOAD_FAIL = '[Assessment] Load Fail';
export const UPDATE_VALUE = '[Assessment] Update Value';
export const SAVE_VALUE = '[Assessment] Save Value';
export const EVALUATE = '[Assessment] Evaluate';
export const CANCEL_EVALUATION = '[Assessment] Cancel Evaluation';

export const TAKE_PIC = '[Assessment] Take picture';
export const UPLOAD_IMG = '[Assessment] Upload Image';
export const UPLOAD_IMG_SUCCESS = '[Assessment] Upload Image Success';
export const UPLOAD_IMG_FAIL = '[Assessment] Upload Image Fail';

/**
 * Load Assessment Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
  constructor(public payload: { record: IRecord, schema: ISchemaEmbedded, referenceId: string, editable: boolean }) { }
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

export class UpdateValue implements Action {
  readonly type = UPDATE_VALUE;
  constructor(public payload: IAttribute) { }
}

export class SaveValue implements Action {
  readonly type = SAVE_VALUE;
}

export class Evaluate implements Action {
  readonly type = EVALUATE;
  constructor(public payload: string) { }
}

export class CancelEvaluation implements Action {
  readonly type = CANCEL_EVALUATION;
}

export class TakePictureAction implements Action {
  readonly type = TAKE_PIC;
  constructor(public payload: {path:string, name:string, index:number}) { }
}

export class UploadImgAction implements Action {
  readonly type = UPLOAD_IMG;
}

export class UploadImgSuccessAction implements Action {
  readonly type = UPLOAD_IMG_SUCCESS;
}

export class UploadImgFailAction implements Action {
  readonly type = UPLOAD_IMG_FAIL;

  constructor(public payload: any) { }
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | UpdateValue
  | SaveValue
  | Evaluate
  | CancelEvaluation
  | TakePictureAction
  | UploadImgAction
  | UploadImgSuccessAction
  | UploadImgFailAction;

export const AssessmentActions = {
  LoadAction, LoadSuccessAction, LoadFailAction, UpdateValue, SaveValue, Evaluate, CancelEvaluation,
  TakePictureAction, UploadImgAction, UploadImgSuccessAction, UploadImgFailAction
}