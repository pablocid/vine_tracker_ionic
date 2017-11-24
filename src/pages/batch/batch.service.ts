import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store'
import { BatchAssessmentActions, AppStates } from '../../app/core/store';
import { find } from 'lodash';
@Injectable()
export class BatchPageService {
    public loading$ = this._store.select(s => s.batchAssessment.loading);
    public schema$ = this._store.select(s => s.batchAssessment.result.schema);
    public elements$ = this._store.select(s => s.batchAssessment.result)
        .map(result => {
            return result.data.map(x => {
                x['schemaId'] = result.schema._id
                return x
            })
        })
        .map(data => {
            return data.sort((a, b) => {
                let sort;
                try {
                    sort = find(a.reference.attributes, { id: '5807afe331f55d0010aaffe6' })['number'] > find(b.reference.attributes, { id: '5807afe331f55d0010aaffe6' })['number'];
                } catch (e) { return 1; }

                if (sort) { return 1; }
                else { return -1; }

            })
        });

    public batchAssessment$ = this._store.select(s => s.batchAssessment);
    public subBatchIdentification$ = this._store.select(s => s.batchAssessment.result)
        .filter(x => !!x.schema && !!x.batch)
        .map(result => {
            const assessmentName = find(result.schema.attributes, { id: 'listViewLabel' })['string'];
            const batchName = find(result.batch.attributes, { id: '5950516708333600119ea445' })['string'];
            //aun no esta descrito en el batch Schema como se divide el batch (sub-batches) 
            let subBatchName;
            if (result.subBatchFilter && Array.isArray(result.subBatchFilter)) {
                for (var i = 0; i < result.subBatchFilter.length; i++) {
                    var element = result.subBatchFilter[i];
                    if (element.key === '5807af9231f55d0010aaffe5') {
                        subBatchName = 'hilera ' + element.value;
                        break;
                    }
                }
            }
            return {
                assessmentName,
                batchName,
                subBatchName
            }
        })

    public updateSelectedAssess() {
        this._store.dispatch(new BatchAssessmentActions.UpdateAssessAction())
    }

    public updatingList$ = this._store.select(s => s.batchAssessment.updatingSelected);

    constructor(
        private _store: Store<AppStates>,
    ) {
        //this._store.dispatch(new BatchAssessmentActions.LoadAction({ assessmentId: '57c42f2fc8307cd5b82f4484', batchId: '594ea47795a22934479bb24a', subBatchFilter: '[{"key":"5807af9231f55d0010aaffe5","value":2,"datatype":"number"}]' }))
    }

    public selectAssess(id: string) {
        this._store.dispatch(new BatchAssessmentActions.SelectAssessAction(id));
    }


}