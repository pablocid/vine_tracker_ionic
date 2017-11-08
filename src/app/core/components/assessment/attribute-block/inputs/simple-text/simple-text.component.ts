import { Component, AfterContentInit, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
    selector: 'simple-text',
    templateUrl: 'simple-text.component.html',
    styles: [`
    .simple-text-textarea{
        width:90%;
        padding: 15px;
        padding-top: 35px;
        font-size: 16px;
        height: 200px;
        border: 2px solid gray;
        border-radius: 5px;
  }
    `]
})
export class SimpleTextComponent extends BaseInputComponent implements AfterContentInit {
    public textData: string = ``;

    public config() {
        this.avatar = 'description';
        this.datatype = 'string';
    }

    public localSave() {
        this.update();
        this.save();
    }

}