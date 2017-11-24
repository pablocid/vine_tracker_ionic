import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuickStartActions, BatchAssessmentActions, AppStates } from '../../app/core/store';
import { find } from 'lodash';

import 'rxjs/add/operator/filter';
@Injectable()
export class QuickStartService {
    private _debug: boolean = false;
    public loading$ = this._store.select(s => s.quickStart.loading);
    public manualPosition$ = this._store.select(s => s.quickStart.entities.manualSearch);
    public recordInfo$ = this._store.select(s => s.quickStart.entities.refInfo);
    public batch$ = this._store.select(s => s.quickStart.entities.batch);
    public status$ = this._store.select(s => s.quickStart.status);
    public assessments$ = this._store
        .select(s => s.quickStart.entities.assessments)
        // .map(x => {

        //     return x.filter((element, index, array) => {
        //         try {
        //             return find(element.attributes, { id: 'editable' })['boolean'];
        //         } catch (e) {
        //             return false;
        //         }
        //     })
        // })
    public hilera$ = this._store.select(s => s.quickStart.entities.refInfo)
        .filter(x => !!x)
        .map(x => x.record.attributes)
        .map(x => find(x, { id: '5807af9231f55d0010aaffe5' })['number'])

    constructor(
        private _store: Store<AppStates>,
    ) {

    }

    updatePosition(espaldera: number, hilera: number, posicion: number) {
        this._store.dispatch(new QuickStartActions.UpdateManualPosition({ espaldera, hilera, posicion }))
    }

    searchManual() {
        this._store.dispatch(new QuickStartActions.LoadManualAction())
    }

    loadBatch(assessmentId: string, batchId: string, subBatchFilter: string) {
        this._store.dispatch(new BatchAssessmentActions.LoadAction({ assessmentId, batchId, subBatchFilter }))
    }

    searchScanner(code: string) {
        this._store.dispatch(new QuickStartActions.LoadScannerAction(code));
    }

}