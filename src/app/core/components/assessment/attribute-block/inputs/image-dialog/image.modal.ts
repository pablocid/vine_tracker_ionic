import { Component, OnInit, Inject } from '@angular/core';
@Component({
    selector: 'image-dialog-modal',
    templateUrl: 'image-dialog.component.html',
    styles: [`
        img {
            width: auto;
            height: auto;
            max-height:700px;
        }
    `]
})

export class ImageDialogComponent implements OnInit {
    constructor(
    ) { }

    ngOnInit() { }
    data
    get src() {
        return this.data;
    }
    get title() {
        return this.data;
    }
    close() {
    }
}