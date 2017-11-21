import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BatchAssessmentService } from './batch-assessment.service';
import * as batchAssessment from './batch-assessment.actions';
import { Store } from '@ngrx/store';
import { AppStates } from '../';

import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class BatchAssessmentEffects {
  constructor(
    private batchAssessmentService: BatchAssessmentService,
    private actions$: Actions,
    private _store: Store<AppStates>
  ) { }

  @Effect() get$ = this.actions$
    .ofType(batchAssessment.LOAD)
    .map(toPayload)
    .switchMap(payload => this.batchAssessmentService.getSubBatchData(payload.assessmentId, payload.batchId, payload.subBatchFilter)
      // If successful, dispatch success action with result
      .map(res => ({ type: batchAssessment.LOAD_SUCCESS, payload: res }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: batchAssessment.LOAD_FAIL }))
    );

  @Effect() updateAssess$ = this.actions$
    .ofType(batchAssessment.UPDATE_ASSESS)
    .map(toPayload)
    .withLatestFrom(this._store.select(s => s.batchAssessment))
    .map(b => {
      try {
        const batchA = b[1];
        const referenceId = batchA.selected.reference._id;
        const assessmentId = batchA.result.schema._id;
        return { referenceId, assessmentId, state: b[1] }
      } catch (e) {
        return { assessmentId: undefined, referenceId: undefined, state: undefined }
      }
    })
    .switchMap(
    payload => this.batchAssessmentService
      .updateSelectedAssessment(payload.assessmentId, payload.referenceId)
      .switchMap(record => this.batchAssessmentService.updateRecordInLIst(payload.state.result.data, record, payload.state.result.schema))
      .map(res => ({ type: batchAssessment.UPDATE_ASSESS_SUCCESS, payload: res }))
      .catch(() => Observable.of({ type: batchAssessment.UPDATE_ASSESS_FAIL }))
    );

}