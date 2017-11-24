import { NgModule } from '@angular/core';
import { PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe } from './';

@NgModule({
    imports: [],
    declarations: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe
    ],
    exports: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe
    ],
    providers: [],
})
export class PipeModule { }
