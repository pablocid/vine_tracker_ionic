import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { BatchPageService } from './batch.service';
import { LoadingController, Loading } from 'ionic-angular';
import { find } from 'lodash';
import 'rxjs/add/operator/filter';


@IonicPage({priority: 'high'})
@Component({
  selector: 'page-batch',
  templateUrl: 'batch.html',
  providers: [BatchPageService]
})

export class BatchPage implements OnInit, OnDestroy {
  public elements$ = this._service.elements$;
  public evaluated$ = this.elements$.map(el => el.filter(x => !x.restricted && x.record));
  public non_evaluated$ = this.elements$.map(el => el.filter(x => !x.restricted && !x.record));
  public restricted$ = this.elements$.map(el => el.filter(x => x.restricted));
  public identificationInfo$ = this._service.subBatchIdentification$;
  public loading$ = this._service.loading$;
  private _queryParamUnsub: Subscription;
  public assessmentName$ = this.identificationInfo$.map(x => x.assessmentName);
  public subBatchName$ = this.identificationInfo$.map(x => {
    return x.batchName + ' ' + x.subBatchName;
  })
  public tabs: string = 'no_evaluados';
  public espalderaLoading: Loading;
  public unLoading: Subscription;
  public unViewDidEnter: Subscription;
  public _dbg = true;
  public updatingList$ = this._service.updatingList$;
  
  private _isFirstLoading = true;



  constructor(
    private _service: BatchPageService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    
  }

  ngOnInit() {

    this.unViewDidEnter = this.navCtrl.viewDidEnter.map(x => x.id)
      .subscribe(x => {
        if (this._dbg) { console.log('viewDidEnter in batch componnent', x); }
        if (x === 'BatchPage' && !this._isFirstLoading) {
          this._service.updateSelectedAssess();
        }
        if(this._isFirstLoading){ this._isFirstLoading = false;}
      })

    this.unLoading = this.loading$.subscribe(x => {
      if (x) {
        this.espalderaLoading = this.loadingCtrl.create({
          content: 'cargando espaldera ...'
        })
        this.espalderaLoading.present();
      } else if(this.espalderaLoading){
        this.espalderaLoading.dismissAll();
        this.espalderaLoading = undefined;
        
      }
    })

  }
  evaluar(schemaId: string, id: string) {
    this._service.selectAssess(id);
    this.navCtrl.push(`AssessmentPage`,
      {
        queryParams: { redirect: 'QuickStartPage', editable: true },
        params: { idRef: id, idAssessment: schemaId }
      })
  }

  gotBack() {
    this.navCtrl.pop();
  }

  output($event) {
    console.log('Event', $event);

  }

  ngOnDestroy() {
    if(this._dbg){console.log('BatchPage ngOnDestroy');}
    if (this._queryParamUnsub) {
      this._queryParamUnsub.unsubscribe();
    }
    if (this.unLoading) {
      this.unLoading.unsubscribe();
    }
    if (this.unViewDidEnter) {
      this.unViewDidEnter.unsubscribe();
    }

    if (this.espalderaLoading) {
      this.espalderaLoading.dismissAll();
      this.espalderaLoading = undefined;
    }
  }

  updateSubBatch(){
    this._service.updateSubBatch();
  }
}