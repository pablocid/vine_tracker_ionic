import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';
import { IRecord, ISchema } from '../../classes';

@Pipe({
    name: 'editable'
})

export class EditablePipe implements PipeTransform {
    constructor(
    ) {

    }
    transform(element: ISchema, ...args: any[]): any {
        try {
            return find(element.attributes, { id: 'editable' })['boolean'];
        } catch (e) {
            return false;
        }
    }
}