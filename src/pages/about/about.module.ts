import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';

@NgModule({
    imports: [IonicPageModule.forChild(AboutPage)],   
    exports: [],
    declarations: [AboutPage],
    providers: [],
})
export class AboutModule { }
