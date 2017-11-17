import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { QuickStartService } from './quick-start.service';
import * as quickStart from './quick-start.actions';
import { Store } from '@ngrx/store';
import { AppStates } from '../';
import { QuickStartActions } from './';


@Injectable()
export class QuickStartEffects {
  constructor(
    private quickStartService: QuickStartService,
    private actions$: Actions,
    private _store: Store<AppStates>
  ) { }

  @Effect() loadManual$ = this.actions$
    .ofType(quickStart.LOAD_MANUAL)
    .withLatestFrom(this._store.select(s => s.quickStart.entities.manualSearch))
    .map(x => {
      return x[1];
    })
    .switchMap(
    payload => this.quickStartService.manualLoading(payload)
      .map(res => (new QuickStartActions.LoadManualSuccessAction(res)))
      .catch(() => Observable.of({ type: quickStart.LOAD_MANUAL_FAIL }))
    )

  @Effect() loadScanner$ = this.actions$
    .ofType(quickStart.LOAD_SCANNER)
    .map(toPayload)
    .switchMap(
    payload => this.quickStartService.getRecordInfoByCode(payload)
      .map(res => (new QuickStartActions.LoadScannerSuccessAction(res)))
      .catch(() => Observable.of({ type: quickStart.LOAD_SCANNER_FAIL }))
    );

  @Effect() load$ = this.actions$
    .ofType(quickStart.LOAD_MANUAL_SUCCESS)
    .withLatestFrom(this._store.select(s => s.quickStart.entities.refInfo))
    .map(x => {
      return x[1];
    })
    .switchMap(
    payload => this.quickStartService.getBatchAndAssessmentsByRecordInfo(payload)
      .map(res => (new QuickStartActions.LoadSuccessAction(res)))
      .catch(() => Observable.of({ type: quickStart.LOAD_FAIL }))
    );

    @Effect() loadAfterScanSuccess$ = this.actions$
    .ofType(quickStart.LOAD_SCANNER_SUCCESS)
    .withLatestFrom(this._store.select(s => s.quickStart.entities.refInfo))
    .map(x => {
      return x[1];
    })
    .switchMap(
    payload => this.quickStartService.getBatchAndAssessmentsByRecordInfo(payload)
      .map(res => (new QuickStartActions.LoadSuccessAction(res)))
      .catch(() => Observable.of({ type: quickStart.LOAD_FAIL }))
    );



  // @Effect() loadSubBatchNumber$ = this.actions$
  //   .ofType(quickStart.LOAD_MANUAL_SUCCESS)
  //   .withLatestFrom(this._store.select(s => s.quickStart.entities.refInfo))
  //   .map(x => {
  //     return x[1];
  //   })
  //   .switchMap(
  //   payload => this.quickStartService.getDistinctSubBatches()
  //     .map(res => (new QuickStartActions.LoadDistinctSubBatchSuccess(res)))
  //     .catch(() => Observable.of({ type: quickStart.LOAD_FAIL }))
  //   );
}