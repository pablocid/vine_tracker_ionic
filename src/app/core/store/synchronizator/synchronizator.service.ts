import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LocalDbStoreService, SynService as SyncService } from '../../services';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class SynchronizatorService {

  constructor(
    private http: Http,
    private _ldb: LocalDbStoreService,
    private _syncs: SyncService
  ) { }

  checkSchm() {
    return Observable.fromPromise(this._syncs.compareSchmDates().then(x=>{
      console.log('checkSchm', x);
      
      return x;
    })).map(x => x.isEqual);
  }

  syncSchm() {
    return Observable.fromPromise(this._syncs.syncSchemas());
  }

  checkBatch() {
    return Observable.fromPromise(this._syncs.compareBatchDates().then(x=>{
      console.log('checkBatch', x);
      
      return x;
    })).map(x => x.isEqual);
  }

  syncBatch() {
    //console.log('synchkirngsdklfd batch');
    
    //return Observable.fromPromise(this._syncs.syncBatchRecords());
    return Observable.fromPromise(this.syncUserAndBatch());
  }

  async syncUserAndBatch() {
    await this._syncs.syncUsers();
    return await this._syncs.syncBatchRecords()
  }


}