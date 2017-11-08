import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RecordService } from '../../services/record-service/record.service';
import { IRecord, ISchemaEmbedded } from '../../classes';
import { find } from 'lodash';
@Injectable()
export class BatchAssessmentService {

  constructor(
    private _rs: RecordService
  ) { }

  get(): Observable<any> {
    return Observable.of({ "message": "OK" });
  }

  getSubBatchData(assessmentId: string, batchId: string, subBatchFilter: string) {
    return Observable.fromPromise(this._rs.getSubBatchData(assessmentId, batchId, subBatchFilter));
  }

  updateSelectedAssessment(schemaId: string, referenceId) {
    if (!schemaId || !referenceId) {
      return Observable.of({});
    }
    return Observable.fromPromise(this._rs.getRecordBySchemaAndReference(schemaId, referenceId));
  }


  // getAssessmentInfo(schema: ISchemaEmbedded, data: { record: IRecord, reference: IRecord, restricted: boolean }[], referenceId: string) {

  //   return Observable.fromPromise(this._makeAssessmentInfo(schema, data, referenceId));
  // }

  // private async _makeAssessmentInfo(schema: ISchemaEmbedded, data: { record: IRecord, reference: IRecord, restricted: boolean }[], referenceId: string) {
  //   const record = await this._rs.getRecordBySchemaAndReference(schema._id, referenceId);
  //   const index = data.map(x => x.reference._id).indexOf(referenceId);
  //   const element = data[index];
  //   element.record = record;
  //   return element;
  // }

}