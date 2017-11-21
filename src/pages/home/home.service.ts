import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SyncActions, AppStates } from '../../app/core/store';

@Injectable()
export class HomeService {
    public checkLoading$ = this._store.select(s => s.sync.checkSchmBatch);
    private _isUpBatch$ = this._store.select(s => s.sync.batch.isUpdated);
    private _isUpSchm$ = this._store.select(s => s.sync.schema.isUpdated);
    private _isUpSchmBatch$ = this._isUpBatch$.switchMap(batch => this._isUpSchm$.map(schm => {
        if (schm && batch) { return true }
        else { return false; }
    }));

    public isUp$ = this._isUpSchmBatch$.switchMap(up => this.checkLoading$.map(check => {
        if (check) { return true; }
        else { return up; }
    }))
    constructor(
        private _store: Store<AppStates>,
    ) { }

    checkSync() {
        this._store.dispatch(new SyncActions.CheckSchmAndBatchAction());
    }
    
}