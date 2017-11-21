import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord, ISchema } from '../../classes';
import { LocalDbStoreService } from '../localdb/localdb.service';
import { Observable } from 'rxjs/Observable';
@Pipe({
    name: 'isWarn'
})

export class IsWarnPipe implements PipeTransform {
    constructor(
        private _ldb: LocalDbStoreService
    ) {

    }
    transform(record: IRecord, ...args: any[]): any {

        return Observable.fromPromise(this._ldb.getSchemaById(record.schm))
            .filter(x => !!x)
            .map(schema => {
                try {
                    const isWarn = find(schema.attributes, { id: 'isWarn' })['listOfObj'];
                    if (!isWarn || !isWarn[0]) { return; }
                    //solo tomaré el primer elemento del array
                    console.log('isWarn[0].id', isWarn[0].id);
                    console.log('value.record.attributes', record.attributes);
                    
                    isWarn[0].string = JSON.parse(isWarn[0].string);

                    const attr = find(record.attributes, { id: isWarn[0].id })['number'];
                    if (isWarn[0].string.$gte) {
                        if (attr >= isWarn[0].string.$gte) { return true }
                        else { return false; }
                    }

                } catch (e) {
                    console.log('Error in IsWarn', e)
                    return;
                }
            });

    }
}