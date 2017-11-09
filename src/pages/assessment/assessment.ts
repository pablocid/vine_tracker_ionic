import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { AssessmentPageService } from './assessment.service';
import { LoadingController, Loading } from 'ionic-angular';
import { find } from 'lodash';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

/**
* Generated class for the AssessmentPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-assessment',
  templateUrl: 'assessment.html',
  providers: [AssessmentPageService]
})
export class AssessmentPage implements OnInit, OnDestroy, AfterContentInit {
  public recordInfo$ = this._service.recordInfo$;
  public loading$: Observable<boolean> = this._service.loading$;
  public allow$: Observable<boolean> = this._service.allow$;
  public editable: boolean = true;
  public editable$: Observable<boolean>;
  public unsub: Subscription;
  public unSaved: Subscription;
  public unCanceled: Subscription;
  public unEditable: Subscription;
  public unLoading: Subscription;
  public unSaveStatus: Subscription;
  public unSaving: Subscription;
  public record$ = this.recordInfo$.map(x => x.record);
  public reference$ = this._service.recordInfo$.map(x => x.reference);
  public inActions$ = new Subject();
  public assessmentName$ = this.recordInfo$.filter(x => !!x.schema).map(x => {
    try {
      return find(x.schema.attributes, { id: "listViewLabel" })['string'];
    } catch (e) {
      return '';
    }
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _service: AssessmentPageService,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssessmentPage');
  }
  ngOnInit() {
    // this._service.resolveParams({ idRef: '57a8d8deef449613775243a8', idAssessment: "580c05b412e1240010cd9d62" });
    // this.editable = true;

    const params = this.navParams.get('params');
    if (params && params.idRef && params.idAssessment) {
      this._service.resolveParams(this.navParams.get('params'));
    } else {
      alert('No existen datos para crear la evaluación')
    }

    this.editable = this.navParams.get('queryParams')['editable'];
  }
  ngAfterContentInit() {
    const loader = this.loadingCtrl.create({
      content: "cargando evaluación..."
    });
    const saver = this.loadingCtrl.create({
      content: "guardando en el servidor ..."
    })

    this.unLoading = this.loading$.subscribe(x => {
      if (x) { loader.present(); } else { loader.dismiss(); }
    })

    this.unSaveStatus = this._service.saveSatus$
      .filter(x => x !== undefined)
      .subscribe(x => {
        console.log('saveSatus$', x);


        if (x === true) {
          //redirect
          if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop()
          } else {
            alert('no se puede redireccionar')
          }
        } else if (x === false) {
          alert("Error en guardado de registro, revisa el internet e intentalo nuevamente");
        }
      })

    this.unSaving = this._service.saving$.subscribe(x => {
      if (x) { saver.present(); } else { saver.dismiss(); }
    })


  }
  ngOnDestroy() {
    if (this.unSaved) {
      this.unSaved.unsubscribe();
    }
    if (this.unCanceled) {
      this.unCanceled.unsubscribe();
    }
    if (this.unLoading) {
      this.unLoading.unsubscribe();
    }
    if (this.unSaving) {
      this.unSaving.unsubscribe();
    }
    if (this.unSaveStatus) {
      this.unSaveStatus.unsubscribe();
    }

  }



  output($event: { message: string, data: any }) {
    console.log('$event', $event);
    if ($event.message === 'save') { this._service.save($event.data); }

    if ($event.message === 'cancel') { }

    //this.redirect();
  }

  public assessSave() {
    this.inActions$.next({ message: 'save' })
  }

  // redirect() {
  //   this.unCanceled = this._activatedRoute.queryParams.subscribe(x => {
  //     if (x && x['redirect']) {
  //       if (x['redirect2']) {
  //         this._router.navigate([x['redirect']], { queryParams: { redirect: x['redirect2'] } });
  //       } else {
  //         this._router.navigate([x['redirect']]);
  //       }
  //     }
  //   })
  // }

}
