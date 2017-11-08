import { NgModule } from '@angular/core';
import { PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe } from './';

@NgModule({
    imports: [],
    declarations: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe
    ],
    exports: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe
    ],
    providers: [],
})
export class PipeModule { }
