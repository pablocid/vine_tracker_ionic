import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AssessmentService } from './assessment.service';
import * as assessment from './assessment.actions';
import {Store} from '@ngrx/store';
import { AppStates } from '../';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AssessmentEffects {
  constructor(
    private assessmentService: AssessmentService,
    private actions$: Actions,
    private _store:Store<AppStates>
  ) { }

  // @Effect() upload$ = this.actions$
  //     .ofType(assessment.UPLOAD_IMG)
  //     .withLatestFrom(this._store.select(s => s.assessment.img))
  //     .map(x=>{
  //       console.log(JSON.stringify(x));
        
  //       return x[1];
  //     })
  //     .switchMap(
  //       payload => this.assessmentService.uploadImage(payload)
  //       // If successful, dispatch success action with result
  //       .map(res => ({ type: assessment.UPLOAD_IMG_SUCCESS}))
  //       // If request fails, dispatch failed action
  //       .catch(() => Observable.of({ type: assessment.UPLOAD_IMG_FAIL}))
  //     );

  @Effect() upload$ = this.actions$
  .ofType(assessment.UPLOAD_IMG)
  .map(toPayload)
  .map(x=>{
    console.log('ToPayload', x);
    
    return x;
  })
  .switchMap(
    payload => this.assessmentService.uploadImage(payload.formData)
    // If successful, dispatch success action with result
    .map(res => ({ type: assessment.UPLOAD_IMG_SUCCESS}))
    // If request fails, dispatch failed action
    .catch(() => Observable.of({ type: assessment.UPLOAD_IMG_FAIL}))
  );
}