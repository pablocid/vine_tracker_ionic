import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord } from '../../classes';
import {LocalDbStoreService} from '../localdb/localdb.service';
import {Observable} from 'rxjs/Observable';
@Pipe({
    name: 'userByName'
})
export class UserByIdPipe implements PipeTransform {
    constructor(
        private _ldb:LocalDbStoreService
    ){

    }
    transform(value: string, ...args: any[]): any {
        try {
            const userName = this._ldb.getUserById(value)
            return Observable.fromPromise(userName).filter(x=>!!x).map(x=>x.name);
        } catch (e) {
            return Observable.of('');
        }
    }
}