import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord } from '../../classes';
import {LocalDbStoreService} from '../localdb/localdb.service';
import {Observable} from 'rxjs/Observable';
@Pipe({
    name: 'userName'
})

export class UserNamePipe implements PipeTransform {
    constructor(
        private _ldb:LocalDbStoreService
    ){

    }
    transform(value: IRecord, ...args: any[]): any {
        try {
            const userId = value.updated
                .map(x => {
                    return { date: new Date(x.date), user: x.user }
                })
                .sort((a, b) => {
                    if (a.date > b.date) { return -1; } else { return 1; }
                })
            [0].user;

            const userName = this._ldb.getUserById(userId)
            return Observable.fromPromise(userName).filter(x=>!!x).map(x=>x.name);
        } catch (e) {
            return;
        }
    }
}