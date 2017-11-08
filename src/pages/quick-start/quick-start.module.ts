import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuickStartPage } from './quick-start';
import { ManualPositionComponent } from '../../app/core/components/manual-position';
import { QRCodeModule } from 'angular2-qrcode';
import { RecordInfoComponent } from '../../app/core/components/record-info';
import { PipeModule } from '../../app/core/services/pipes/pipe.module';
import { AssessmentListComponent } from '../../app/core/components/assessment-list/assessment-list.component';
@NgModule({
  declarations: [
    QuickStartPage,
    ManualPositionComponent,
    RecordInfoComponent,
    AssessmentListComponent
  ],
  imports: [
    IonicPageModule.forChild(QuickStartPage),
    QRCodeModule,
    PipeModule
  ],
})
export class QuickStartPageModule { }
