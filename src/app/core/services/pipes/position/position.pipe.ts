import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';

@Pipe({ name: 'position' })
export class PositionPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (!value || !Array.isArray(value.attributes)) { return; }

        try {
            let posicion: string;
            posicion = 'E' + (<any>find(value.attributes, { id: '5807af5f31f55d0010aaffe4' }))['number'];
            posicion += ' H' + (<any>find(value.attributes, { id: '5807af9231f55d0010aaffe5' }))['number'];
            posicion += ' P' + (<any>find(value.attributes, { id: '5807afe331f55d0010aaffe6' }))['number'];
            return posicion;
        } catch (e) { return; }
    }
}