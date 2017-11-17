import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendService, LocalDbStoreService } from '../../services';

@Injectable()
export class AssessmentService {

  constructor(
    private _bs: BackendService,
  ) { }

  uploadImage(formData:FormData) {
    return this._bs.upload(formData);
  }


}