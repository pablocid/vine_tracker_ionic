import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from 'ionic-angular';
import { Transfer } from '@ionic-native/transfer';
/** MAIN SERVICES **/
import { BackendService } from '../services/backend/backend.service';
import { LocalDbStoreService } from '../services/localdb/localdb.service';
import { SynService } from '../services/sync/synchronizator.service';
import { RecordService } from '../services/record-service/record.service';

//Reducers & Effects
import { AuthReducer, AuthEffects, AuthState, AuthService } from './auth';
import { AssessmentQueryReducer, AssessmentQueryEffects, AssessmentQueryState, AssessmentQueryService } from './assessment-query';
import { AssessmentReducer, AssessmentState, AssessmentService, AssessmentEffects } from './assessment';

import { QuickStartReducer, QuickStartEffects, QuickStartService, QuickStartState } from './quick-start';
import { BatchAssessmentReducer, BatchAssessmentEffects, BatchAssessmentService, BatchAssessmentState } from './batch-assessment';
import { SyncReducer, SynchronizatorEffects, SynchronizatorService, SyncState } from './synchronizator';

export interface AppStates {
    assessments: { selected: any, assessments: any[] },
    auth: AuthState,
    assessmentQuery: AssessmentQueryState,
    assessment: AssessmentState,
    quickStart: QuickStartState,
    batchAssessment: BatchAssessmentState,
    sync: SyncState
}
//el key de los reducers debe coincidir con la interface AppStates
const reducers = {
    auth: AuthReducer,
    assessmentQuery: AssessmentQueryReducer,
    assessment: AssessmentReducer,
    quickStart: QuickStartReducer,
    batchAssessment: BatchAssessmentReducer,
    sync: SyncReducer
};

const effects = [
    AuthEffects,
    AssessmentQueryEffects,
    AssessmentEffects,
    QuickStartEffects,
    BatchAssessmentEffects,
    SynchronizatorEffects
];

const services = [
    AuthService,
    AssessmentQueryService,
    AssessmentService,
    QuickStartService,
    BatchAssessmentService,
    SynchronizatorService
];


@NgModule({
    imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        IonicModule
    ],
    declarations: [
    ],
    exports: [],
    providers: [
        BackendService,
        LocalDbStoreService,
        SynService,
        RecordService,
        Transfer,
        ...services
    ]
})

export class CoreStoreModule { };