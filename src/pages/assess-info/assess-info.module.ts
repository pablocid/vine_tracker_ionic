import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessInfoModalPage } from './assess-info';
import { PipeModule } from '../../app/core/services/pipes/pipe.module';

@NgModule({
  declarations: [
    AssessInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AssessInfoModalPage),
    PipeModule
  ],
  exports: [
    AssessInfoModalPage
  ]
})
export class AssessInfoModalPageModule {}