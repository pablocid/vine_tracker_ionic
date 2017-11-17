import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { find } from 'lodash';
import { UUID } from 'angular2-uuid';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import 'rxjs/add/operator/map';

import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Loading } from 'ionic-angular';
@Component({
    selector: 'selection-list',
    templateUrl: './picture-list.component.html'
})
export class PictureListComponent extends BaseInputComponent {

    public images$: Observable<string[]>;
    public editableImages$: Observable<string[]>;
    public numOfPics$: Observable<number>;
    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public picUrl: Observable<string>;
    public unUpload: Subscription;
    public uploadInicator: Loading;

    public config() {
        this.datatype = 'list';
        this.avatar = 'photo';
        this.picUrl = this.attrSchm$.map(attrsSchm => {
            try { return find(attrsSchm.attributes, { id: 'picUrl' })['string'] }
            catch (e) { return; }
        });
        this.images$ = this.value$.switchMap(value => this.picUrl.map(picUrl => {
            return value.filter(x => x).map(img => picUrl + img);
        }));

        this.numOfPics$ = this.attrSchm$.map(attrsSchm => {
            try { return find(attrsSchm.attributes, { id: 'numOfPics' })['number']; }
            catch (error) { console.log('problema con la propiedad numOfPics'); return 0; }
        });

        this.editableImages$ = this.value$.switchMap(
            value => this.picUrl.switchMap(picUrl =>
                this.numOfPics$.map(numOfPics => {
                    const vals = [];
                    for (let i = 0; i < numOfPics; i++) {
                        var pic = value[i];
                        if (pic) { pic = picUrl + pic; }
                        vals.push(pic);
                    }
                    return vals;
                })
            )
        );

        this.unUpload = this.uploading$.subscribe(x => {
            if (x) {
                
                this.uploadInicator = this.loadingCtrl.create({ content: 'subiendo imagen al servidor ...' });
                this.uploadInicator.present();
            } else {
                if (this.uploadInicator) { this.uploadInicator.dismiss(); }
                this.uploadInicator = undefined;
            }
        })

    }

    public deleteImage(index: number) {
        if (confirm('Estas seguro de borrar esta imagen?.')) {
            this.localValue.splice(index, 1);
            this.update();
        }
    }

    public addImage(formData: FormData, index) {
        // const fdata =  new FormData();
        // fdata.append('file', fdata.get('file'))
        // this.currentIndexImg = index;
        console.log('file', formData.get('file')['name'], 'index', index);

        this.upload({ name: formData.get('file')['name'], index, formData })
    }

    destroy() {
        if (this.unUpload) { this.unUpload.unsubscribe(); }
    }



}