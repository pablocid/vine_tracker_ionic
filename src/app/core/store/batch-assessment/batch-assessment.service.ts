import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RecordService } from '../../services/record-service/record.service';
import { IRecord, ISchemaEmbedded } from '../../classes';
import { find, cloneDeep } from 'lodash';
@Injectable()
export class BatchAssessmentService {
  private _dbg:boolean = false;
  constructor(
    private _rs: RecordService
  ) { }

  get(): Observable<any> {
    return Observable.of({ "message": "OK" });
  }

  getSubBatchData(assessmentId: string, batchId: string, subBatchFilter: string) {
    return Observable.fromPromise(this._rs.getSubBatchData(assessmentId, batchId, subBatchFilter));
  }

  updateSelectedAssessment(schemaId: string, referenceId): Observable<IRecord> {
    if (!schemaId || !referenceId) {
      return Observable.of();
    }
    return Observable.fromPromise(this._rs.getRecordBySchemaAndReference(schemaId, referenceId));
  }

  public updateRecordInLIst(data: { record: IRecord, reference: IRecord, restricted: boolean, isWarn: boolean }[], record: IRecord, assessSchm: ISchemaEmbedded): Observable<{ record: IRecord, reference: IRecord, restricted: boolean, isWarn: boolean }[]> {
    if(this._dbg){console.log('Updated Record is: ',record);}

    try {
      const idRef = find(record.attributes, { id: '57c42f77c8307cd5b82f4486' })['reference'];
      const index = data.map(x => x.reference._id).indexOf(idRef);
      if (index !== -1) {
        let p = data[index];
        if (record.schm !== assessSchm._id) {
          return Observable.of(data);;
        }
        p.record = record;
        p.isWarn = this._isWarn(record, assessSchm);
        data.splice(index, 1);
        data.push(p);

        return Observable.of(cloneDeep(data));
      } else {
        return Observable.of(data);;
      }
    } catch (e) {
      if(this._dbg){console.log('Error in finding update selected record',);}
      return Observable.of(data);
    }
  }

  private _isWarn(record: IRecord, schema: ISchemaEmbedded) {
    if(this._dbg){console.log('Record and schema', {record, schema});}
    
    try {
      const isWarn = cloneDeep(find(schema.attributes, { id: 'isWarn' })['listOfObj']);
      if (!isWarn || !isWarn[0]) { return; }

      isWarn[0].string = JSON.parse(isWarn[0].string);

      const attr = find(record.attributes, { id: isWarn[0].id })['number'];
      if (isWarn[0].string.$gte) {
        if (attr >= isWarn[0].string.$gte) { return true }
        else { return false; }
      }

    } catch (e) {
      if(this._dbg){console.log('Error in IsWarn',e);}
      return false;
    }
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