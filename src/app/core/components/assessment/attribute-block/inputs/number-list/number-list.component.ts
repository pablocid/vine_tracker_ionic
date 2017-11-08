import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { Observable } from 'rxjs/Observable';
import { find, clone } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'number-list',
    templateUrl: 'number-list.component.html',
    changeDetection:ChangeDetectionStrategy.OnPush
})

export class NumberListComponent extends BaseInputComponent {
    public unit$: Observable<string>;
    public integers$: Observable<number[]>;
    public decimales: number[];
    public int: number;
    public dec: number;
    public numSubscription: Subscription;
    public integer$: Observable<number>;
    public decimal$: Observable<number>;


    public config() {
        this.avatar = 'format_list_numbered';
        this.datatype = 'number';
        this.unit$ = this.attrSchm$.map(attrSchm => {
            try { return find(attrSchm.attributes, { id: 'unit' })['string']; }
            catch (e) { return; }
        });

        this.integers$ = this.attrSchm$.map(attrSchm => {
            let max;
            try { max = find(attrSchm.attributes, { id: 'maxVal' })['number'] } catch (e) { max = 5; }
            let min;
            try { min = find(attrSchm.attributes, { id: 'minVal' })['number'] } catch (e) { min = 0; }

            try {
                const floatOpt = find(attrSchm.attributes, { id: 'floatOpt' });

                this.decimales = [];
                if (floatOpt) {
                    switch (floatOpt['string']) {
                        case 'even':
                            for (var e = 0; e < 10; e++) {
                                if (e % 2 === 0) {
                                    this.decimales.push(e);
                                }
                            }
                            break;
                        case 'odd':
                            for (var e = 0; e < 10; e++) {
                                if (e % 2 !== 0) {
                                    this.decimales.push(e);
                                }
                            }
                            break;
                        case 'all':
                            for (var e = 0; e < 10; e++) {
                                this.decimales.push(e);
                            }
                            break;
                    }
                }

                var list = [];
                for (var i = min; i <= max; i++) {
                    list.push(i);
                }
                return list;
            }
            catch (e) { return; }
        });

        this.integer$ = this.value$.map(x => {
            try {
                if (x) {
                    return this.int = parseInt(x.toString().split('.')[0]);
                } else {
                    return 0;
                }
            }
            catch (e) { }
        });
        this.decimal$ = this.value$.map(x => {
            try {
                if (x) {
                    return parseInt(x.toString().split('.')[1]);
                } else {
                    return 0;
                }
            }
            catch (e) { }
        });

    }

    public subscriptions() {
        this.numSubscription = this.value$.subscribe(x => {
            try {
                if (x) {
                    this.int = parseInt(x.toString().split('.')[0]);
                    this.dec = parseInt(x.toString().split('.')[1]);
                } else {
                    this.int = 0;
                    this.dec = 0;
                }
            }
            catch (e) { }
        });
    }

    public unsubscriptions() {
        if (this.numSubscription) { this.numSubscription.unsubscribe(); }
    }

    public localSave() {
        if (this.int !== undefined && this.dec !== undefined) {
            this.localValue = parseFloat(this.int + '.' + this.dec);
            console.log('modificando', this.int, this.dec);

        }
        console.log('localSave', this.localValue);

        this.update();
        this.save();
    }

    public localReset() {
        this.reset();
        this.int = undefined;
        this.dec = undefined;
    }
}