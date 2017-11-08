import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessmentPage } from './assessment';
import {AssessmentModule} from '../../app/core/modules/assessment-input.modules';

@NgModule({
  declarations: [
    AssessmentPage
  ],
  imports: [
    IonicPageModule.forChild(AssessmentPage),
    AssessmentModule
  ]
})
export class AssessmentPageModule { }
