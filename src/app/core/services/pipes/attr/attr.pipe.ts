import { Pipe, PipeTransform } from '@angular/core';
import {find} from 'lodash';
@Pipe({
    name: 'attr'
})

export class AttrPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        // console.log('value', value);
        // console.log('args', args);
        const key=args[0];
        const dt=args[1];
        
        if(!key || !dt){ return; }
        try{
            return (<any>find(value.attributes, {id:key}) )[dt];
        }catch(e){ return;}
    }
}