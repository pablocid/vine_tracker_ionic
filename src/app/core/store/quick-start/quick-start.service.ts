import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RecordService } from '../../services/record-service/record.service'
import { IRecordInfo, IRecord, ISchemaEmbedded } from '../../classes';
import { find } from 'lodash';

@Injectable()
export class QuickStartService {

  constructor(
    private _rs: RecordService
  ) { }

  public manualLoading(current: { espaldera: number, hilera: number, posicion: number }): Observable<IRecordInfo> {
    return this._rs.getRecordInfoByPosition(current.espaldera, current.hilera, current.posicion);
  }

  private async _getBatchAndAssessmentsByRecordInfo(rInfo: IRecordInfo): Promise<{ batch: IRecord, assessments: ISchemaEmbedded[] }> {
    const batch = await this._rs.getBatchByRecord(rInfo.record);
    const assessments = await this._rs.getAssessments(batch);
    return { batch, assessments };
  }
  public getBatchAndAssessmentsByRecordInfo(rInfo: IRecordInfo): Observable<{ batch: IRecord, assessments: ISchemaEmbedded[] }> {
    return Observable.fromPromise(this._getBatchAndAssessmentsByRecordInfo(rInfo));
  }

  public getDistinctSubBatches(): Observable<number[]> {
    return this._rs.distinctSubBatchNumbers('sdf', 'sdf', 'sdf');
  }

  public getRecordInfoByCode(code:string):Observable<IRecordInfo> {
      return this._rs.getRecordInfoByCode(code);
  }

}