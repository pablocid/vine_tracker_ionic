import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickStartService } from './quick-start.service';
import { IRecordInfo } from '../../app/core/classes'
import { Subscription } from 'rxjs/Subscription';
import { LoadingController, Loading } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-quick-start',
  templateUrl: 'quick-start.html',
  providers: [QuickStartService]
})
export class QuickStartPage {
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: QuickStartService,
    public loadingCtrl: LoadingController

  ) {
    this.loader = this.loadingCtrl.create({ content: 'cargando ...' })
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
      if (x) { this.loader.present() }
      else { this.loader.dismissAll() }
    })
  }
  ngOnDestroy() {
    if (this.unInfo) { this.unInfo.unsubscribe(); }
    if (this._unLoading) { this._unLoading.unsubscribe() }
  }

  search(current) {
    this._service.searchManual();
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