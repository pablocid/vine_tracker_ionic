import { Component, ViewChild, ElementRef, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickStartService } from './quick-start.service';
import { IRecordInfo } from '../../app/core/classes'
import { Subscription } from 'rxjs/Subscription';
import { LoadingController, Loading } from 'ionic-angular';

//import { } from 'jimp';
//import * as Instascan from 'qr-code-scanner';
//const Instascan = require('instascan')
//const QRScanner = window.QRScanner
import { QrScannerComponent } from '../../app/core/modules/angular2-qrscanner/src/qrscanner.component';

declare var ImageCapture
@IonicPage()
@Component({
  selector: 'page-quick-start',
  templateUrl: 'quick-start.html',
  providers: [QuickStartService]
})
export class QuickStartPage implements AfterViewChecked, AfterViewInit, AfterContentInit {
  public loading$ = this._service.loading$;
  public currentPosition$ = this._service.manualPosition$;
  public info$ = this._service.recordInfo$;
  public rInfo: IRecordInfo;
  public unInfo: Subscription;
  public batch$ = this._service.batch$;
  public assessments$ = this._service.assessments$;
  public response: any;
  public hilera: number;
  public hilera$ = this._service.hilera$;
  public unHilera: Subscription;
  public loader: Loading;
  private _unLoading: Subscription;
  public imageCapture: any;
  public imgSrc;
  public picInfo;
  public searchOption: string = 'manual';
  private _unStatus: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: QuickStartService,
    public loadingCtrl: LoadingController

  ) {
  }


  @ViewChild('can') canvas: ElementRef;
  @ViewChild('vid') video: ElementRef;
  @ViewChild('fotoCanv') fotoCanv: ElementRef;
  @ViewChild('imagen') imagen: ElementRef;


  @ViewChild('scanner') scanner: QrScannerComponent;

  ngAfterViewChecked() { }
  ngAfterContentInit() { }

  ngAfterViewInit() { // wait for the view to init before using the element


  }


  takePic() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        this.video.nativeElement.srcObject = mediaStream;

        const track = mediaStream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(track);
      })
      .catch(error => console.log(error));

  }
  onGrabFrameButtonClick() {
    this.imageCapture.grabFrame()
      .then(imageBitmap => {
        const canvas = this.canvas.nativeElement;
        this.drawCanvas(canvas, imageBitmap);
      })
      .catch(error => console.log(error));
  }


  onTakePhotoButtonClick() {
    this.imageCapture.takePhoto()
      .then((blob: Blob) => {
        console.log('URL.createObjectURL(blob);', URL.createObjectURL(blob));
        console.log('blob', blob);

        this.imagen.nativeElement.src = URL.createObjectURL(blob);
        this.imagen.nativeElement.onload = () => { URL.revokeObjectURL(this.imagen.nativeElement.src); }
      })
      // .then(blob => createImageBitmap(blob))
      // .then(imageBitmap => {
      //   const canvas = this.fotoCanv.nativeElement;
      //   this.drawCanvas(canvas, imageBitmap);
      // })

      .catch(error => console.log(error));
  }

  drawCanvas(canvas, img) {
    this.imgSrc = img;
    // canvas.width = 1000//getComputedStyle(canvas).width.split('px')[0];
    // canvas.height = 1000 //getComputedStyle(canvas).height.split('px')[0];
    // let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
    // let x = (canvas.width - img.width * ratio) / 2;
    // let y = (canvas.height - img.height * ratio) / 2;
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
    //     x, y, img.width * ratio, img.height * ratio);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuickStartPage');
  }



  ngOnInit() {
    this.unInfo = this.info$.subscribe(info => {
      this.rInfo = info;
    });
    this.unHilera = this.hilera$.subscribe(hilera => {
      this.hilera = hilera;
    });
    this._unLoading = this.loading$.subscribe(x => {
      if (x) {
        this.loader = this.loadingCtrl.create({ content: 'cargando ...' });
        this.loader.present();
      }
      else {
        if (this.loader) { this.loader.dismissAll(); }
        this.loader = undefined;
      }
    })

    this._unStatus = this._service.status$.subscribe(x => {
      if (x === false) {
        alert('No se encontró ninguna planta relacionada en la base de datos.')
      }
    })
  }
  ngOnDestroy() {
    if (this.unInfo) { this.unInfo.unsubscribe(); }
    if (this._unLoading) { this._unLoading.unsubscribe(); }
    if (this._unStatus) { this._unStatus.unsubscribe(); }
  }

  search(current) {
    this._service.searchManual();
  }

  searchScanner(code: string) {
    this._service.searchScanner(code);
  }

  onPositionChange(current) {
    console.log('change')
    this._service.updatePosition(current.espaldera, current.hilera, current.posicion);
  }

  goTo(assessmentId) {
    this.navCtrl.push(`AssessmentPage`,
      {
        queryParams: { redirect: 'QuickStartPage', editable: true },
        params: { idRef: this.rInfo.record._id, idAssessment: assessmentId }
      })
  }
  toSync() {
    this.navCtrl.push(`SyncPage`);
  }

  goQuery(assessmentId) {
    this.navCtrl.push(`AssessmentPage`,
      {
        queryParams: { redirect: 'QuickStartPage', editable: false },
        params: { idRef: this.rInfo.record._id, idAssessment: assessmentId }
      })
  }

  loadBatch(data) {
    this._service.loadBatch(data.assessmentId, data.batchId, `[{"key":"5807af9231f55d0010aaffe5","value":${this.hilera},"datatype":"number"}]`)
  }

  public asessmentListAction(action: { message: string, data: any }) {
    console.log(action);
    switch (action.message) {
      case 'single':
        this.goTo(action.data);
        break;
      case 'batch':
        this.loadBatch(action.data);
        this.navCtrl.push(`BatchPage`, { queryParams: { redirect: 'quick-start' } })
        break;
      case 'query':
        this.goQuery(action.data);
        break;
      default:
        break;
    }
  }

}