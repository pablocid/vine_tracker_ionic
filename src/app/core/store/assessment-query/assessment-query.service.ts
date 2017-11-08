import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendService, LocalDbStoreService } from '../../services';
import { ISchemaEmbedded } from '../../classes';
import { find } from 'lodash';
import { IRecord } from '../../classes';

@Injectable()
export class AssessmentQueryService {
  private _dbg: boolean = true;

  constructor(
    private _bs: BackendService,
    private _ldb: LocalDbStoreService,
  ) { }

  get(payload): Observable<{ record: IRecord, schema: ISchemaEmbedded, referenceId: string, allow: boolean }> {

    return Observable.fromPromise(this.getRecordInfo(payload));
  }

  async getRecordInfo({ referenceId, assessmentId }): Promise<{ record: IRecord, schema: ISchemaEmbedded, referenceId: string, allow: boolean }> {
    let allow = true;

    const record = await this._bs.findOneRecordBySearch({
      schm: assessmentId,
      filter: [{ key: '57c42f77c8307cd5b82f4486', value: referenceId, datatype: 'reference' }]
    });

    const schema = <ISchemaEmbedded>await this._ldb.getSchemaEmbedded(assessmentId);
    allow = await this.setAllow(schema, referenceId);
    return { record, schema, referenceId, allow };
  }

  async setAllow(schema, referenceId) {
    let restriction;
    try {
      restriction = find(schema.attributes, { id: 'restriction' })['listOfObj'];
    } catch (e) {
      return true;
    }
    const search: any = {
      schm: null,
      filter: []
    };
    //current reference
    search.filter.push({ key: '57c42f77c8307cd5b82f4486', value: referenceId, datatype: 'reference' });
    //schema
    const indxSchm = restriction.map(x => x.id).indexOf('schm');
    if (indxSchm !== -1) { search.schm = restriction[indxSchm].string; }
    //more filters
    const filters = restriction.filter(f => f.id === 'filter');
    if (filters && filters.length) {
      filters.forEach(x => {
        const f = x.string.split('|');
        //check if si string or json
        const value = /^\{.*\}$/.test(f[1]) ? JSON.parse(f[1]) : f[1];
        search.filter.push({ key: f[0], value, datatype: f[2] })
      });
    }

    const recordRequisit = await this._bs.findOneRecordBySearch(search);

    return recordRequisit && recordRequisit._id ? true : false;
  }

  save(record: IRecord, isNew: boolean) {
    return this._bs.saveRecord(record, isNew);
  }

}
