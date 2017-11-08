import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AssessmentQueryService } from './assessment-query.service';
import * as assessmentQuery from './assessment-query.actions';
import { Store } from '@ngrx/store';
import { AppStates } from '../';

@Injectable()
export class AssessmentQueryEffects {
  constructor(
    private assessmentQueryService: AssessmentQueryService,
    private actions$: Actions,
    private _store:Store<AppStates>
  ) { }

  @Effect() get$ = this.actions$
    .ofType(assessmentQuery.LOAD)
    .map(toPayload)
    .switchMap(
    payload => this.assessmentQueryService.get(payload)
      // If successful, dispatch success action with result
      .map(res => (new assessmentQuery.LoadSuccessAction(res)))
      // If request fails, dispatch failed action
      .catch((e) => {
        console.log('Error', e);

        return Observable.of(new assessmentQuery.LoadFailAction(e));
      })
    );
  @Effect() save$ = this.actions$
    .ofType(assessmentQuery.SAVE)
    .map(toPayload)
    .withLatestFrom(this._store.select(s => s.assessment.entities.isNew))
    .switchMap(
    payload => this.assessmentQueryService.save(payload[0], payload[1])
      // If successful, dispatch success action with result
      .map(res => (new assessmentQuery.SaveSuccessAction()))
      // If request fails, dispatch failed action
      .catch((e) => {
        console.log('request fails, dispatch failed action', e);
        
        return Observable.of(new assessmentQuery.SaveFailAction(e));
      })
    );
}