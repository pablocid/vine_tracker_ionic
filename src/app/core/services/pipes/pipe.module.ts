import { NgModule } from '@angular/core';
import { PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe } from './';
import { UserByIdPipe } from './user-by-id.pipe';

@NgModule({
    imports: [],
    declarations: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe, UserByIdPipe
    ],
    exports: [
        PositionPipe, AttrPipe, SchmAttrPipe, UpdateInfoPipe, UserNamePipe, IsWarnPipe, EditablePipe, UserByIdPipe
    ],
    providers: [],
})
export class PipeModule { }
