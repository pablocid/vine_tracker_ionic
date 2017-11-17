import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessmentPage } from './assessment';
import { AssessmentModule } from '../../app/core/modules/assessment-input.modules';
import { PipeModule } from '../../app/core/services/pipes/pipe.module';
@NgModule({
  declarations: [
    AssessmentPage
  ],
  imports: [
    IonicPageModule.forChild(AssessmentPage),
    AssessmentModule,
    PipeModule
  ],
})
export class AssessmentPageModule { }
