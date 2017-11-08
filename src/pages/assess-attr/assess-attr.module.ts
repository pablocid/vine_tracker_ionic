import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessAttrPage } from './assess-attr';
import { AssessmentModule } from '../../app/core/modules/assessment-input.modules';

@NgModule({
  declarations: [
    AssessAttrPage
  ],
  imports: [
    IonicPageModule.forChild(AssessAttrPage),
    AssessmentModule
  ]
})
export class AssessAttrPageModule { }
