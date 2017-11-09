import { Component, Output, EventEmitter, Renderer, Input, OnDestroy, OnInit, ViewContainerRef, ChangeDetectionStrategy, TemplateRef, ViewChild, AfterContentInit } from '@angular/core';
import { find } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IAttributeSchema, IAttribute, ISchemaEmbedded, IRecord } from '../../../../../classes';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UUID } from 'angular2-uuid';
import { File as FileNative } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import 'rxjs/add/operator/map';
declare var cordova: any;

@Component({
    selector: 'base-input',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BaseInputComponent implements AfterContentInit, OnInit, OnDestroy {
    lastImage: string = null;
    loading: Loading;
    public viewMode: string = 'cardView';
    public editable: boolean = false;
    public editMode: string = 'modal';
    public schemaId: string;
    public localValue: any;
    public datatype: string;
    public avatar: string;
    public output = new EventEmitter<{ message: string, data?: any }>();

    public schema$: Observable<ISchemaEmbedded>;
    public record$: Observable<IRecord>;
    public recordAttrs$: Observable<IAttribute[]>;
    public attrSchm$: Observable<IAttributeSchema>;
    public value$: Observable<any>;
    public valueSubs: Subscription;
    public schmAttrs$: Observable<IAttribute[]>;
    public name$: Observable<string>;
    public shortName$: Observable<string>;
    public existValue$: Observable<boolean>;
    public uploadPicture$: Observable<{ loading: boolean, entities: { [id: string]: any }, result: any, error: boolean }>;
    public uploading$: Observable<boolean>;
    public imgInfo$: Observable<{ path: string, name: string, index: number }>;
    public currentImgPath$: Observable<string>;
    public uploadStatus$: Observable<boolean>;
    public successfullyUploaded$: Observable<boolean>;
    private _unsubscriptions$: { value: Subscription, selectedIndexSubs: Subscription } = { value: null, selectedIndexSubs: null };
    private _localRenderer: Function;
    public currentIndexImg: number;
    public currentIndex$: Observable<number>;
    public showCardView$:Observable<boolean>;
    private unUploading: Subscription;

    constructor(
        private photoViewer: PhotoViewer,
        private camera: Camera,
        private _renderer: Renderer,
        private transfer: Transfer,
        private file: FileNative,
        private filePath: FilePath,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public loadingCtrl: LoadingController
    ) { }
    ngOnInit() {
    }

    ngAfterContentInit() {
        this._config();
        this.config();
        this._setTemplate();

        //por alguna razon, poner antes las subscripciones el valor es undefined
        this._subscriptions();
        this.subscriptions();
    }
    ngOnDestroy() {
        this._unsubscriptions();
        this.unsubscriptions();
        this.destroy();
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    public takePicture(sourceType) {
        if (this.unUploading) { this.unUploading.unsubscribe(); }

        this.loading = this.loadingCtrl.create({
            content: 'subiendo foto ...',
        });

        this.unUploading = this.uploading$.subscribe(x => {
            if (x) {
                this.loading.present();
            }
            else { this.loading.dismissAll(); }
        })
        // Create options for the Camera Dialog
        var options = {
            quality: 50,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        const name = this.createFileName();
        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, name);
                        this.takePic({ path: this.pathForImage(name), name, index: this.currentIndexImg });

                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, name);
                this.takePic({ path: this.pathForImage(name), name, index: this.currentIndexImg });
            }
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }
    // Create a new name for the image
    private createFileName() {
        const newName = UUID.UUID();
        console.log('const newName = UUID.UUID();', newName);
        return newName + ".jpg";
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = "https://pmg-restful-dev.herokuapp.com/api/uploads";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        };

        const fileTransfer: TransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast('Image succesful uploaded.');
        }, err => {
            console.log(err)
            console.log(JSON.stringify(err));
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }

    private _picFullName(name, ext) {
        return `${name}.${ext}`;
    }

    public showPicture(url) {
        this.photoViewer.show(url)
    }

    //templates
    @ViewChild('entry', { read: ViewContainerRef }) entry: ViewContainerRef;
    @ViewChild('listViewTmpl') listViewTmpl: TemplateRef<any>;
    @ViewChild('cardViewTmpl') cardViewTmpl: TemplateRef<any>;
    @ViewChild('cardEditViewTmpl') cardEditViewTmpl: TemplateRef<any>;

    private _config() {
        this.recordAttrs$ = this.record$.map(record => record.attributes);
        this.schmAttrs$ = this.schema$.map(schema => schema.attributes);
        this.attrSchm$ = this.schema$.map(schema => find(schema.Attributes, { _id: this.schemaId }));
        this.value$ = this.recordAttrs$.map(attributes => {
            try {
                if (this.datatype === 'list') {
                    const list = find(attributes, { id: this.schemaId })[this.datatype];
                    if (list && Array.isArray(list)) { return list; }
                    //inicializa la variable
                    return [];
                }
                return find(attributes, { id: this.schemaId })[this.datatype]
            }
            catch (e) {
                //inicializa la variable
                if (this.datatype === 'list') { return []; }
                return undefined;
            }
        });
        this.name$ = this.attrSchm$.map(attrSchm => this._findSchmConfAttrByName(attrSchm.attributes, 'description'));
        this.shortName$ = this.attrSchm$.map(attrSchm => this._findSchmConfAttrByName(attrSchm.attributes, 'label'));
        this.existValue$ = this.value$.map(value => {
            if (Array.isArray(value) && value.length === 0) { return false; }
            if (this.localValue === undefined || this.localValue === null) { return false; }
            return true;
        });
        this.showCardView$ = this.existValue$
        .map(existValue => {
            if (this.editable) { return true; }
            if (existValue) { return true; }
            return false;
        })
    }
    public config() { }

    private _subscriptions() {
        this.valueSubs = this.value$.subscribe(x => (this.localValue = x));
    }
    public subscriptions() { }

    private _unsubscriptions() {
        if (this._unsubscriptions$.value) { this._unsubscriptions$.value.unsubscribe(); }
        if (this.valueSubs) { this.valueSubs.unsubscribe(); }
        if (this.unUploading) { this.unUploading.unsubscribe(); }

    }
    public unsubscriptions() { }

    public destroy() { }

    private _findSchmConfAttrByName(attributes, id: string) {
        try { return find(attributes, { id })['string']; }
        catch (e) {
            return;
        }
    }

    public save() {
        this.output.emit({ message: 'save' });
    }

    public cancel() {
        this.output.emit({ message: 'cancel' });
    }

    public assess() {

        this.output.emit({ message: 'assess' });
    }

    public update() {
        this.output.emit({ message: 'update', data: { id: this.schemaId, [this.datatype]: this.localValue } });
    }

    public upload(formData: { path: string, name: string }) {
        this.output.emit({ message: 'upload' })
    }

    public takePic(data: { path: string, name: string, index: number }) {
        console.log('takepic in base-input');

        this.output.emit({ message: 'takePicture', data });
    }

    private _setTemplate() {
        switch (this.viewMode) {
            case 'listView':
                try { this.entry.createEmbeddedView(this.listViewTmpl); }
                catch (e) { console.log('Error: No existe el template listView'); }
                break;
            case 'cardView':
                try { this.entry.createEmbeddedView(this.cardViewTmpl); }
                catch (e) { console.log('Error: No existe template cardView'); }
                break;
            case 'cardEditView':
                try { this.entry.createEmbeddedView(this.cardEditViewTmpl); }
                catch (e) { console.log('Error: No existe template cardView'); }
                break;
            default:
                try { this.entry.createEmbeddedView(this.cardViewTmpl); }
                catch (e) { console.log('Error: No existe template listView'); }
        }
    }

    public showImage(src, title) {
        console.log('Image show');
        this.photoViewer.show(src, title)
        //this.dialog.open(ImageDialogComponent, { data: { src, title } })
    }

    public reset() {
        this.localValue = undefined;
        if (this.datatype === 'list') { this.localValue = []; }
        this.update();
    }
}
