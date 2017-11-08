import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';

@Pipe({
    name: 'schmAttr'
})

export class SchmAttrPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        try {
            const dts = (<any>find(value.attributes, { id: 'keys' }))['listOfObj']
            let dt = <any>find(dts, { id: args[0] });
            if (!dt) { dt = 'string' } else { dt = dt['string'] }
            return find(value.attributes, { id: args[0] })[dt];
        } catch (e) {
            return;
        }

    }
}