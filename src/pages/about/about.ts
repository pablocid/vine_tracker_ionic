import { Component, OnInit, NgZone, AfterContentInit } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { Options, ImageResult } from "ngx-image2dataurl";

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit, AfterContentInit {
  public result: any;
  public loader:Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ngZone: NgZone,
    public lctrl:LoadingController
  ) {

  }

  src: string = null;
  options: Options = {
    resize: {
      maxHeight: 128,
      maxWidth: 128
    },
    allowedExtensions: ['JPG', 'PnG']
  };
 
  selected(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    console.log('imageResult', imageResult);
    console.log('dataURLtoFile', this.dataURLtoFile(imageResult.resized.dataURL, 'krapname'));
    
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

  ngOnInit() { }

  ngAfterContentInit() {
    // this.loader = this.lctrl.create({content:'procesando ...'});
    // this.loader.present();
    // const myWorker = new Worker('./assets/workers/image.worker.js');

    // myWorker.onmessage = (event) => {
    //   this.ngZone.run(() => {
    //     this.result = event.data.join(',');
    //     this.loader.dismiss();

    //   })
    // };

    // myWorker.postMessage('startQuickSort');
  }


}
