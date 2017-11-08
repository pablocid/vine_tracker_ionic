import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickStartService } from './quick-start.service';
import { IRecordInfo } from '../../app/core/classes'
import { Subscription } from 'rxjs/Subscription';
/**
 * Generated class for the QuickStartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: QuickStartService

  ) {
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
    })
  }
  ngOnDestroy() {
    this.unInfo.unsubscribe();
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
    this.navCtrl.push(`assessment/${this.rInfo.record._id}/${assessmentId}`, { queryParams: { redirect: 'quick-start', editable: false } });
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
        this.navCtrl.push(`sub-batch-elements`, { queryParams: { redirect: 'quick-start' } })
        break;
      case 'query':
        this.goQuery(action.data);
        break;
      default:
        break;
    }
  }

}