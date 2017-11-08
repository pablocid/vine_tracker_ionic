import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { find } from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'selection-list',
    templateUrl: './selection-list.component.html',
})

export class SelectionListComponent extends BaseInputComponent {
    //formType: imageList | optionsList |
    public isImageList = true;
    public imgOptionSelected$: Observable<string>;
    public optionValue$: Observable<string>;
    public options$: Observable<{ id: string, value: string, image: string }[]>;
    public option$: Observable<{ id: string, value: string, image: string }>;

    config() {
        this.datatype = 'string';
        this.avatar = 'radio_button_checked';
        this.options$ = this.attrSchm$
            .map(attrSchm => attrSchm.attributes)
            .map(attributes => {
                let optionImages: Array<{ id: string, string: string }>;
                try { optionImages = find(attributes, { id: 'optionImages' })['listOfObj']; } catch (e) { }

                let options: Array<{ id: string, string: string }>;
                try { options = find(attributes, { id: 'options' })['listOfObj'] } catch (e) { console.log('error no options ', e); }

                return options.map(opt => {
                    let image;
                    try { image = find(optionImages, { id: opt.id })['string'] } catch (e) { };

                    return { id: opt.id, value: opt.string, image }
                })

            })
        this.option$ = this.value$
            .switchMap(id => this.options$.map(options => find(options, { id })));

        this.imgOptionSelected$ = this.value$
            .switchMap(
            id => this.attrSchm$
                .map(attrSchm => attrSchm.attributes)
                .filter(attributes => {
                    try { return find(attributes, { id: 'formType' })['string'] === 'imageList'; }
                    catch (e) { console.log('error en filtrar formType ', e); return false; }
                })
                .map(attributes => {
                    try { return find(find(attributes, { id: 'optionImages' })['listOfObj'], { id })['string']; }
                    catch (e) { console.log('error no image ', e); return; }
                })
            );

        this.optionValue$ = this.value$
            .switchMap(
            id => this.attrSchm$
                .map(attrSchm => attrSchm.attributes)
                .map(attributes => {
                    if (id === undefined) { return; }
                    try { return find(find(attributes, { id: 'options' })['listOfObj'], { id })['string']; }
                    catch (e) { console.log('error getting optionValue ', e); return; }
                })
            );
    }





    onChangeRadio(e) {
        console.log('updating');
        
        this.update();
    }

}
