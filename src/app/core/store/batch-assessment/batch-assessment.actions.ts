import { Action } from '@ngrx/store';
import { IRecord, ISchemaEmbedded } from '../../classes';
export const LOAD = '[Batch Assessment] Load';
export const LOAD_SUCCESS = '[Batch Assessment] Load Success';
export const LOAD_FAIL = '[Batch Assessment] Load Fail';
export const UPDATE = '[Batch Assessment] Update';

export const LOAD_ASSESSMENT = '[Batch Assessment] Load Assessment';
export const LOAD_ASSESSMENT_SUCCESS = '[Batch Assessment] Load Assessment Success';
export const LOAD_ASSESSMENT_FAIL = '[Batch Assessment] Load Assessment Fail';

export const SELECT_ASSESS = '[Batch Assessment] Select Assess';
export const UPDATE_ASSESS = '[Batch Assessment] Update Assess';
export const UPDATE_ASSESS_SUCCESS = '[Batch Assessment] Update Assess Success';
export const UPDATE_ASSESS_FAIL = '[Batch Assessment] Update Assess Fail';

/**
 * Load Batch Assessment Actions
 */
export class LoadAction implements Action {
  readonly type = LOAD;
  constructor(public payload: { assessmentId: string, batchId: string, subBatchFilter: string }) { }
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: {
    schema: ISchemaEmbedded,
    schemaRef: ISchemaEmbedded,
    batch: IRecord,
    subBatchFilter: any,
    data: { record: IRecord, reference: IRecord, restricted: boolean, isWarn: boolean }[]
  }) { }
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) { }
}

export class SelectAssessAction implements Action {
  readonly type = SELECT_ASSESS;

  constructor(public payload: string) { }
}

export class UpdateAssessAction implements Action {
  readonly type = UPDATE_ASSESS;
}

export class UpdateAssessSuccessAction implements Action {
  readonly type = UPDATE_ASSESS_SUCCESS;

  constructor(public payload: { record: IRecord, reference: IRecord, restricted: boolean, isWarn: boolean }[]) { }
}

export class UpdateAssessFailAction implements Action {
  readonly type = UPDATE_ASSESS_FAIL;

  constructor(public payload: any) { }
}

export class UpdateAction implements Action {
  readonly type = UPDATE;
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | UpdateAction
  | SelectAssessAction
  | UpdateAssessAction
  | UpdateAssessSuccessAction
  | UpdateAssessFailAction;

export const BatchAssessmentActions = {
  LoadAction, LoadSuccessAction, LoadFailAction, UpdateAction, SelectAssessAction, UpdateAssessAction, UpdateAssessSuccessAction, UpdateAssessFailAction
}