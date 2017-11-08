import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'simple-ref',
    templateUrl: './simple-ref.component.html',
})

export class SimpleRefComponent extends BaseInputComponent {
    public invalidReference$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public config() {
        this.datatype = 'reference';
        this.avatar = 'fingerprint';
    }

    public localSave() {
        this.update();
        this.save();
    }

    onchange() {
        console.log('CHangeskljdlajfd');
        
        if (/^[0-9a-f]{24}$/i.test(this.localValue)) { this.invalidReference$.next(false); }
        else { this.invalidReference$.next(true); }
    }
}