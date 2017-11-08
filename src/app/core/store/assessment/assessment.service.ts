import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendService, LocalDbStoreService } from '../../services';

@Injectable()
export class AssessmentService {

  constructor(
    private _bs: BackendService,
  ) { }

  uploadImage(info) {
    console.log('InStore assesment upload inmage info', info);
    
    return Observable.fromPromise(this._bs.uploadImage(info.path, info.name));
  }


}