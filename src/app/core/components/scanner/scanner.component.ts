import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { QrScannerComponent } from '../../modules/angular2-qrscanner/src/qrscanner.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'scanner',
    templateUrl: 'scanner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ScannerComponent implements OnInit, OnDestroy {
    public isScanning: boolean = false;
    public result: string;
    public isScanning$ = new BehaviorSubject<boolean>(false);
    private unSubScan: Subscription;

    constructor(
        private ref: ChangeDetectorRef
    ) { }
    
    @ViewChild('scanner') scanner: QrScannerComponent;
    @Output() code = new EventEmitter<string>();

    ngOnInit() {
        this.unSubScan = this.isScanning$.subscribe(x => {
            console.log('isScanning change');
            this.ref.markForCheck();
        })
    }
    ngOnDestroy() {
        if (this.unSubScan) { this.unSubScan.unsubscribe(); }
    }

    scan() {
        this.isScanning$.next(true);
        this.scanner.startScanning();

    }

    stopScan() {
        this.scanner.stopScanning();
        this.isScanning$.next(false);
    }

    decodedOutput($event) {
        console.log('$event', $event);
        this.isScanning$.next(false);
        this.code.emit($event);
    }
}