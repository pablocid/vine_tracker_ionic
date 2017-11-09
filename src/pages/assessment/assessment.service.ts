import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssessmentQueryActions, AppStates } from '../../app/core/store';
import { IRecord } from '../../app/core/classes';

@Injectable()
export class AssessmentPageService {
    public loading$ = this._store.select(state => state.assessmentQuery.loading);
    public saved$ = this._store.select(s => s.assessmentQuery.saved);
    public saveSatus$ = this._store.select(s => s.assessmentQuery.saveStatus);
    public saving$ = this._store.select(s => s.assessmentQuery.saving);
    public allow$ = this._store.select(s => s.assessmentQuery.result.allow);
    public recordInfo$ = this._store.select(state => state.assessmentQuery.result);
    constructor(
        private _store: Store<AppStates>
    ) { }

    getResult() {
        this._store.select(state => state.assessmentQuery.result).subscribe(x => {
            console.log(x);

        })
        return this._store.select(state => state.assessmentQuery.result)
    }

    save(record: IRecord) {
        this._store.dispatch(new AssessmentQueryActions.SaveAction(record));
    }

    resolveParams(params) {
        this._store.dispatch(new AssessmentQueryActions.LoadAction({ referenceId: params.idRef, assessmentId: params.idAssessment }));
    }
}