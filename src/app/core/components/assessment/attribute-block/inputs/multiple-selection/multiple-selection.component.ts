import { Component, OnInit, ChangeDetectionStrategy, Input, AfterContentInit } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { find } from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'multiple-selection',
    templateUrl: './multiple-selection.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleSelectionComponent extends BaseInputComponent implements OnInit {
    public optionList$: Observable<{ id: string, isChecked: boolean, string: string }[]>;
    public selectedOptions$: Observable<string[]>;

    public checkToggle:boolean = true;

    config() {
        this.datatype = 'list';
        this.avatar = 'check_box';
        this.optionList$ = this.attrSchm$.switchMap(attrSchm => this.value$.map(value => {            
            try {
                return find(attrSchm.attributes, { id: 'options' })['listOfObj']
                    .map(x => {
                        const o = find(value, m => m === x.id);
                        if (o) { x.isChecked = true } else { x.isChecked = false }
                        return x;
                    });
            } catch (e) { 
                console.log('Error in multiple-selection option list', e);
            }
        }));
        this.selectedOptions$ = this.optionList$.map(x => x.filter(f => f.isChecked).map(m => m.string));
    }
    
    onChangeToggle(option) {
        const index = this.localValue.indexOf(option.id);
        if (index === -1) { this.localValue.push(option.id); }
        else { this.localValue.splice(index, 1); }
        this.update();
    }
}