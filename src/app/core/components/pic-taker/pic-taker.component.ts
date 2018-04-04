import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import LoadImage from 'blueimp-load-image';
import { UUID } from 'angular2-uuid';
import { Ng2ImgMaxService } from 'ng2-img-max';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { LoadingController, Loading } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Options, ImageResult } from "ngx-image2dataurl";

@Component({
    selector: 'pic-taker',
    templateUrl: 'pic-taker.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class PicTakerComponent implements OnInit, OnDestroy {
    public picInfo;
    public formData: FormData = new FormData();
    public processLoader: Loading;
    private _unSubEventChange: Subscription;
    private _dbg:false;

    constructor(
        private ref: ChangeDetectorRef,
        private ng2ImgMaxService: Ng2ImgMaxService,
        private _loadCtrl: LoadingController
    ) {
    }
    @ViewChild('inputPhoto') inputPhoto: ElementRef;
    // @ViewChild('holder') holder: ElementRef;

    @Output() form: EventEmitter<FormData> = new EventEmitter();

    ngOnInit() {
    }
    ngOnDestroy() {
        if (this._unSubEventChange) { this._unSubEventChange.unsubscribe(); }
    }

    ngDoCheck() { 
        if(this._dbg){console.log('cd');} 
    }

    upload() {
        this.form.emit(this.formData);
        // this._erasePicture();
        this.formData.delete('file');
    }


    remove() {
        // this._erasePicture();
        this.formData.delete('file');
        this.ref.markForCheck();
    }


    ngAfterViewInit() {
        // this._unSubEventChange = Observable.fromEvent(this.inputPhoto.nativeElement, 'change')
        //     .map(x => {
        //         if (!this.processLoader) {
        //             this.processLoader = this._loadCtrl.create({ content: 'procesando imagen ...' });
        //             this.processLoader.present();
        //         }
        //         return x
        //     })
        //     .switchMap(
        //     (e: any) => this.ng2ImgMaxService.resize([e.target.files[0]], 800, 800)
        //         .map(x => {
        //             if (this.processLoader) {
        //                 this.processLoader.dismiss();
        //                 this.processLoader = undefined;
        //             }
        //             return x;
        //         })
        //     )
        //     .subscribe(e => {
        //         this.ref.markForCheck();
        //         console.log('switchMap', e)
        //         this.onPhotoInputChange(e)
        //     });

        // this._unSubEventChange = Observable.fromEvent(this.inputPhoto.nativeElement, 'change')
        //     .map(x => {
        //         if (!this.processLoader) {
        //             this.processLoader = this._loadCtrl.create({ content: 'procesando imagen ...' });
        //             this.processLoader.present();
        //         }
        //         return x
        //     })
        //     .switchMap(
        //     (e: any) => this.ng2ImgMaxService.resize([e.target.files[0]], 800, 800)
        //         .map(x => {
        //             if (this.processLoader) {
        //                 this.processLoader.dismiss();
        //                 this.processLoader = undefined;
        //             }
        //             return x;
        //         })
        //     )
        //     .subscribe(e => {
        //         this.ref.markForCheck();
        //         console.log('switchMap', e)
        //         this.onPhotoInputChange(e)
        //     });

    }

    src: string = null;
    options: Options = {
        resize: {
            maxHeight: 700,
            maxWidth: 700
        },
        allowedExtensions: ['JPG', 'PnG']
    };

    selected(imageResult: ImageResult) {
        if (imageResult.error) alert(imageResult.error);
        if(this._dbg){console.log('imageResult', imageResult);}
        if(this._dbg){ console.log('dataURLtoFile', this.dataURLtoFile(imageResult.resized.dataURL, 'krapname'));}

        if(this.setImageInForm(this.dataURLtoFile(imageResult.resized.dataURL, 'tmp_name'))){
         if(this._dbg){console.log('setImageInForm OK');}
         this.upload()
        }else{
            if(this._dbg){console.log('setImageInForm Errror');}
        }
    }

    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    takePicture() {
        this.inputPhoto.nativeElement.click();
    }

    button() {
    }

    // onPhotoInputChange(e: File) {

    //     const options = {
    //         maxWidth: 300,
    //         maxHeight: 300,
    //         contain: true,
    //         orientation: true,
    //         canvas: true,
    //         pixelRatio: devicePixelRatio
    //     };
    //     const self = this;
    //     this.setImage(e).then(x => {
    //         if (x) {
    //             console.log('LoadImage ....');

    //             LoadImage(e, (result) => {
    //                 self._erasePicture();
    //                 console.log('Loaded ....');
    //                 self.holder.nativeElement.appendChild(result);
    //             }, options);
    //         }
    //     })
    // }

    // private _erasePicture() {
    //     while (this.holder.nativeElement.firstChild) {
    //         this.holder.nativeElement.removeChild(this.holder.nativeElement.firstChild);
    //     }
    // }

    public setImageInForm(file: File): boolean {
        const newName = UUID.UUID();
        const maxsize = 3000000;
        if (
            file && file.size <= maxsize &&
            (file.type === 'image/jpeg' || file.type === 'image/png')
        ) {
            let format = file.type === 'image/jpeg' ? 'jpg' : 'png';
            const theName = `${newName}.${format}`;
            if(this._dbg){console.log('NewName', theName);}

            this.formData.append("file", file, theName);
            if(this._dbg){console.log('formData', this.formData.get('file'));}

            return true;
        } else {
            if (file && (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
                alert('Solo se pueden subir fotos en formato jpeg o png.\nFormato actual: ' + file.type, );
            } else if (file && file.size > maxsize) {
                alert(`No se pueden subir fotos mayores a ${(maxsize / 1000000)}MB.\nActual tamaño de archivo: ${(file.size / 1000000).toFixed(1)}MB `, );
            }
            return false;
        }
    }

    public async setImage(file: File): Promise<boolean> {
        const newName = UUID.UUID();
        const maxsize = 3000000;
        if (
            file && file.size <= maxsize &&
            (file.type === 'image/jpeg' || file.type === 'image/png')
        ) {
            let format = file.type === 'image/jpeg' ? 'jpg' : 'png';
            const theName = `test.${newName}.${format}`;
            if(this._dbg){console.log('NewName', theName);}

            this.formData.append("file", file, theName);
            if(this._dbg){console.log('formData', this.formData.get('file'));}

            return true;
        } else {
            if (file && (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
                alert('Solo se pueden subir fotos en formato jpeg o png.\nFormato actual: ' + file.type, );
            } else if (file && file.size > maxsize) {
                alert(`No se pueden subir fotos mayores a ${(maxsize / 1000000)}MB.\nActual tamaño de archivo: ${(file.size / 1000000).toFixed(1)}MB `, );
            }
            return false;
        }
    }





}