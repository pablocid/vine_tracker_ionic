import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from '../components/assessment/assessment.component';
import { AttributeBlockComponent } from '../components/assessment/attribute-block/attribute-block.component';
import { MarkdownModule } from 'angular2-markdown';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicModule } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { File as FileNative } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { PicTakerComponent } from '../components/pic-taker/pic-taker.component';

import { Ng2ImgMaxModule } from 'ng2-img-max';
const IMPORTS = [
    CommonModule,
    IonicModule,
    MarkdownModule.forRoot(),
    QRCodeModule,
    Ng2ImgMaxModule
];

import {
    SimpleTextComponent,
    SimpleRefComponent,
    SelectionListComponent,
    NumberListComponent,
    MultipleSelectionComponent,
    PictureListComponent, 
    ImageDialogComponent,
    BaseInputComponent
} from '../components/assessment/attribute-block/inputs';
const INPUTS_COMPONENTS = [
    ImageDialogComponent,
    SimpleTextComponent,
    SimpleRefComponent,
    SelectionListComponent,
    NumberListComponent,
    MultipleSelectionComponent,
    PictureListComponent,
    BaseInputComponent
];

const COMPONENTS = [
    AssessmentComponent,
    AttributeBlockComponent,
    PicTakerComponent
];
@NgModule({
    imports:[
        ...IMPORTS,
    ],
    exports: [
        ...COMPONENTS
    ],
    declarations: [
        ...INPUTS_COMPONENTS,
        ...COMPONENTS
    ],
    entryComponents: [
        ...INPUTS_COMPONENTS
    ],
    providers:[
        PhotoViewer,
        Camera,
        FileNative,
        Transfer,
        FilePath,
    ]
})
export class AssessmentModule { }