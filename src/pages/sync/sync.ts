import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SynchronizerService } from './sync.service';
import { LoadingController, Loading } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
  providers: [SynchronizerService]
})
export class SyncPage implements OnInit, OnDestroy {
  public checking_schm$ = this._service.checkingSchm$;
  public isSchmUpdated$ = this._service.isSchmUpdated$;
  public schmSynchronizing$ = this._service.schmSynchronizing$;
  public syncStatus$ = this._service.syncSchmStatus$;

  public checkingBatch$ = this._service.checkingBatch$;
  public isBatchUpdated$ = this._service.isBatchUpdated$;
  public batchSynchronizing$ = this._service.batchSynchronizing$;
  public syncBatchStatus$ = this._service.syncBatchStatus$;

  private _unCheckingSchm: Subscription;
  private _uncheckingBatch: Subscription;
  private _unSyncSchm: Subscription;
  private _unSyncBatch: Subscription;
  private _unCheckingSchmBatch: Subscription;

  private loaderCheckSchm: Loading
  private loaderCheckBatch: Loading
  private loaderSyncSchm: Loading
  private loaderSyncBatch: Loading
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: SynchronizerService,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    //this.loaderCheckSchm = this.loadingCtrl.create({ content: 'revisando si los esquemas están actualizados' });
    this.loaderCheckBatch = this.loadingCtrl.create({ content: 'revisando si las espalderas están actualizados' });
    this.loaderSyncSchm = this.loadingCtrl.create({ content: 'sincronizando esquemas' });
    this.loaderSyncBatch = this.loadingCtrl.create({ content: 'sincronizando espalderas' });

    // const loaderCheckSchmBatch = this.loadingCtrl.create({ content: 'revisando actualizaciones ...' });

    this._unCheckingSchm = this._service.checkingSchm$.subscribe(x => {
      if (x) {
        if (!this.loaderCheckSchm) { this.loaderCheckSchm = this.loadingCtrl.create({ content: 'revisando si los esquemas están actualizados' }); }
        this.loaderCheckSchm.present();
      } else {
        if (this.loaderCheckSchm) {
          this.loaderCheckSchm.dismiss();
          this.loaderCheckSchm = null;
        }
      }
    });
    this._uncheckingBatch = this._service.checkingBatch$.subscribe(x => {
      if (x) { this.loaderCheckBatch.present(); } else { this.loaderCheckBatch.dismiss().catch(); }
    });
    this._unSyncSchm = this._service.schmSynchronizing$.subscribe(x => {
      if (x) { this.loaderSyncSchm.present(); } else { this.loaderSyncSchm.dismiss().catch(); }
    })
    this._unSyncBatch = this._service.batchSynchronizing$.subscribe(x => {
      if (x) { this.loaderSyncBatch.present(); } else { this.loaderSyncBatch.dismiss(); }
    })

    // this._unCheckingSchmBatch = this._service.checkingSchmBatch$.subscribe(x => {
    //   if (x) { this.loaderCheckSchmBatch.present(); } else { this.loaderCheckSchmBatch.dismissAll(); }
    // })

    setTimeout(() => {
      this.checkSchmAndBatch();
    }, 500)
  }

  checkSchmAndBatch(){
    this._service.checkSchmAndBatch();
  }

  ngOnDestroy() {
    if (this._unCheckingSchm) {
      this._unCheckingSchm.unsubscribe();
    }
    if (this._uncheckingBatch) {
      this._uncheckingBatch.unsubscribe();
    }
    if (this._unSyncSchm) {
      this._unSyncSchm.unsubscribe();
    }
    if (this._unSyncBatch) {
      this._unSyncBatch.unsubscribe();
    }
    if (this._unCheckingSchmBatch) {
      this._unCheckingSchmBatch.unsubscribe();
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
  }

  checkSchm() {
    this._service.chechSchm();
  }

  checkBatch() {
    this._service.checkBatch();
  }

  syncSchemas() {
    this._service.syncSchm();
  }

  syncBatches() {
    this._service.syncBatch();
  }

}
