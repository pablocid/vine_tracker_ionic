import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SynchronizerService} from './sync.service';

/**
 * Generated class for the SyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
  providers:[SynchronizerService]
})
export class SyncPage {
  public checking_schm$ = this._service.checkingSchm$;
  public isSchmUpdated$ = this._service.isSchmUpdated$;
  public schmSynchronizing$ = this._service.schmSynchronizing$;
  public syncStatus$ = this._service.syncSchmStatus$;

  public checkingBatch$ = this._service.checkingBatch$;
  public isBatchUpdated$ = this._service.isBatchUpdated$;
  public batchSynchronizing$ = this._service.batchSynchronizing$;
  public syncBatchStatus$ = this._service.syncBatchStatus$;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _service:SynchronizerService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
  }

  checkSchm() {
    this._service.chechSchm();
  }

  checkBatch(){
    this._service.checkBatch();
  }

  syncSchemas() {
    this._service.syncSchm();
  }

  syncBatches() {
    this._service.syncBatch();
  }

}
