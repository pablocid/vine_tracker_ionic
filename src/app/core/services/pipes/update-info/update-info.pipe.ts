import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord } from '../../../classes';
@Pipe({
    name: 'updateInfo'
})

export class UpdateInfoPipe implements PipeTransform {
    transform(value: IRecord, ...args: any[]): any {
        try {
            const date = value.updated
                .map(x => x.date)
                .map(x => new Date(x))
                .sort()
                .reverse()
            [0];
            //return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            return date.toLocaleString()

        } catch (e) {
            return;
        }

    }
}