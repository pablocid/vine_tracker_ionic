import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord, ISchema } from '../../classes';
import { LocalDbStoreService } from '../localdb/localdb.service';
import { Observable } from 'rxjs/Observable';
@Pipe({
    name: 'isWarn'
})

export class IsWarnPipe implements PipeTransform {
    private _dbg = true;
    constructor(
        private _ldb: LocalDbStoreService
    ) {

    }
    transform(record: IRecord, ...args: any[]): any {

        return Observable.fromPromise(this.getResponse(record))
            .filter(x => !!x);
    }

    private async getResponse(record: IRecord) {
        if (this._dbg) { console.log('Se esta ejecutando el isWarn Pipe', ); }
        const schema = await this._ldb.getSchemaById(record.schm);
        if (!schema) { return; }

        try {
            const isWarn = find(schema.attributes, { id: 'isWarn' })['listOfObj'];
            if (!isWarn || !isWarn[0]) { return; }
            //solo tomaré el primer elemento del array

            isWarn[0].string = JSON.parse(isWarn[0].string);
            const attrSchm = await this._ldb.getSchemaById(isWarn[0].id);
            const dd = find(attrSchm.attributes, { id: 'datatype' })['string'];
            const attr = find(record.attributes, { id: isWarn[0].id })[dd];

            if (isWarn[0].string.hasOwnProperty("$gte")) {
                if (attr >= isWarn[0].string.$gte) { return true }
                else { return false; }
            }

            if (isWarn[0].string.hasOwnProperty("$eq")) {
                if (attr === isWarn[0].string.$eq) {
                    return true;
                } else {
                    return false;
                }
            }

        } catch (e) {
            console.log('Error in IsWarn', e)
            return;
        }
    }
}