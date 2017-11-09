import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BatchPage } from './batch';
import {AssessmentModule} from '../../app/core/modules/assessment-input.modules';
import { PipeModule } from '../../app/core/services/pipes/pipe.module';

@NgModule({
  declarations: [
    BatchPage
  ],
  imports: [
    IonicPageModule.forChild(BatchPage),
    AssessmentModule,
    PipeModule
  ]
})
export class BatchPageModule { }
