import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates, AssessmentActions, AssessmentQueryActions } from '../../app/core/store';
import { IRecord, IAttribute, IAttributeSchema } from '../../app/core/classes'
import { find } from 'lodash';
import 'rxjs/add/operator/filter';

@Injectable()
export class AssessAttrService {
    public editing$ = this._store.select(s => s.assessment.editing);
    public attr$ = this._store.select(s => s.assessment.entities.record)
        .switchMap(record => this.editing$.filter(x => !!x).map(attr => {
            return <IAttribute>find(record.attributes, { id: attr.id });
        }))

    constructor(
        private _store: Store<AppStates>
    ) { }

    public attributeAssess$ = this._store
        .select(s => s.assessment.entities.schema.Attributes)
        .switchMap(
        AttrSchms => this.editing$.filter(x => !!x)
            .map(value => <IAttributeSchema>find(AttrSchms, { _id: value.id }))
        );
    public save() {
        this._store.dispatch(new AssessmentActions.SaveValue());
    }

    public update(data) {
        console.log('Update', data);

        this._store.dispatch(new AssessmentActions.UpdateValue(data));
    }
    public cancel() {
        this._store.dispatch(new AssessmentActions.CancelEvaluation());
    }

    public uploadImage(data) {
        this._store.dispatch(new AssessmentActions.UploadImgAction(data));
    }

    public takePicture(data) {
        console.log('takePicture in assess-attr service');
        
        this._store.dispatch(new AssessmentActions.TakePictureAction(data));
    }

}