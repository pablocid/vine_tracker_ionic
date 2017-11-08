import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IRecord, ISchemaEmbedded } from '../../classes';
@Component({
    selector: 'record-info',
    templateUrl: 'record-info.component.html'
})

export class RecordInfoComponent implements OnInit {
    constructor() { }
    @Input('info') info: { record: IRecord, schema: ISchemaEmbedded };
    @Output('action') action: EventEmitter<{ event: string, message: string, data: any }> = new EventEmitter();
    
    ngOnInit() { }
}