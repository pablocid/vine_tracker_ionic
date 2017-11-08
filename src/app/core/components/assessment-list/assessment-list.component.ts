import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISchemaEmbedded, IRecord, IRecordInfo } from '../../classes';
@Component({
    selector: 'assessment-list',
    templateUrl: 'assessment-list.component.html'
})

export class AssessmentListComponent implements OnInit {
    constructor() { }
    @Input() assessments: ISchemaEmbedded;
    @Input() batch: IRecord;
    @Input('record-info') recordInfo: IRecordInfo;

    @Output('action') action = new EventEmitter<{ message: string, data?: any }>();

    ngOnInit() { }

    btnAction(action: string, data?: any) {
        this.action.next({ message: action, data });
    }

}