import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates, SyncActions } from '../../app/core/store';

@Injectable()
export class SynchronizerService {
    public checkingSchm$ = this._store.select(s => s.sync.schema.checking);
    public isSchmUpdated$ = this._store.select(s => s.sync.schema.isUpdated);
    public schmSynchronizing$ = this._store.select(s => s.sync.schema.synchronizing);
    public syncSchmStatus$ = this._store.select(s => s.sync.schema.syncStatus);

    public checkingBatch$ = this._store.select(s => s.sync.batch.checking);
    public isBatchUpdated$ = this._store.select(s => s.sync.batch.isUpdated);
    public batchSynchronizing$ = this._store.select(s => s.sync.batch.synchronizing);
    public syncBatchStatus$ = this._store.select(s => s.sync.batch.syncStatus);

    public checkingSchmBatch$ = this._store.select(s => s.sync.checkSchmBatch);

    constructor(
        private _store: Store<AppStates>
    ) { }

    chechSchm() {
        this._store.dispatch(new SyncActions.CheckSchmAction());
    }

    syncSchm() {
        this._store.dispatch(new SyncActions.SyncSchmAction());
    }

    checkBatch() {
        this._store.dispatch(new SyncActions.CheckBatchesAction());
    }

    syncBatch() {
        this._store.dispatch(new SyncActions.SyncBatchAction());
    }

    checkSchmAndBatch() {
        this._store.dispatch(new SyncActions.CheckSchmAndBatchAction());
    }

}