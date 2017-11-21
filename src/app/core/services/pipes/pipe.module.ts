import { NgModule } from '@angular/core';
import { PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe } from './';

@NgModule({
    imports: [],
    declarations: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe
    ],
    exports: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe
    ],
    providers: [],
})
export class PipeModule { }
