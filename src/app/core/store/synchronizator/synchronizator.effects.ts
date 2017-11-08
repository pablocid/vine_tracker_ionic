import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { SynchronizatorService } from './synchronizator.service';
import * as synchronizator from './synchronizator.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SynchronizatorEffects {
  constructor(
    private synchronizatorService: SynchronizatorService,
    private actions$: Actions
  ) { }

  @Effect() checkSchm$ = this.actions$
    .ofType(synchronizator.CHECK_SCHM)
    .switchMap(payload => this.synchronizatorService.checkSchm()
      // If successful, dispatch success action with result
      .map(res => ({ type: synchronizator.CHECK_SCHM_SUCCESS, payload: res }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: synchronizator.CHECK_SCHM_FAIL }))
    );

  @Effect() syncSchm$ = this.actions$
    .ofType(synchronizator.SYNC_SCHM)
    .switchMap(payload => this.synchronizatorService.syncSchm()
      // If successful, dispatch success action with result
      .map(res => ({ type: synchronizator.SYNC_SCHM_SUCCESS, payload: res }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: synchronizator.SYNC_SCHM_FAIL }))
    );

  @Effect() checkBatch$ = this.actions$
    .ofType(synchronizator.CHECK_BATCH)
    .switchMap(payload => this.synchronizatorService.checkBatch()
      // If successful, dispatch success action with result
      .map(res => ({ type: synchronizator.CHECK_BATCH_SUCCESS, payload: res }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: synchronizator.CHECK_BATCH_FAIL }))
    );

  @Effect() syncBatch$ = this.actions$
    .ofType(synchronizator.SYNC_BATCH)
    .switchMap(payload => this.synchronizatorService.syncBatch()
      // If successful, dispatch success action with result
      .map(res => ({ type: synchronizator.SYNC_BATCH_SUCCESS, payload: res }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: synchronizator.SYNC_BATCH_FAIL }))
    );
}