import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterContentInit, ChangeDetectionStrategy, EmbeddedViewRef, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { Record, Schema, IAttribute, IAttributeSchema, ISchemaEmbedded, IRecord, IUpdated } from '../../classes';
import { find, clone } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppStates, AssessmentActions } from '../../store';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentComponent implements OnDestroy {
  tab1: any;
  tab2: any;

  public attrSchms$: Observable<IAttributeSchema[]>;
  public selectedIndex: number;
  public selectedIndex$: Observable<number>;
  public editing$: Observable<IAttribute>;
  public attributeAssess$: Observable<IAttributeSchema>;
  public assessmentComponent: EmbeddedViewRef<any>;
  public unsubscriptions: { isEditingSubs: Subscription, selectedIndexSubs: Subscription, record: Subscription } = { isEditingSubs: null, selectedIndexSubs: null, record: null };
  public record: IRecord;
  public unsubExternalAction:Subscription;
  constructor(
    private _store: Store<AppStates>,
    private _navCtrl: NavController
  ) {
    // this.tab1 = TabsTextContentPage;
    // this.tab2 = TabsTextContentPage;
  }

  ngOnInit() {
    this.unsubscriptions.record = this._store.select(s => s.assessment.entities.record).subscribe(x => {
      this.record = x
    });
  }

  ngOnDestroy() {
    if (this.unsubscriptions.isEditingSubs) { this.unsubscriptions.isEditingSubs.unsubscribe(); }
    if (this.unsubscriptions.selectedIndexSubs) { this.unsubscriptions.selectedIndexSubs.unsubscribe(); }
    if (this.unsubscriptions.selectedIndexSubs) { this.unsubscriptions.record.unsubscribe(); }
  }


  @ViewChild('entry', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild('viewEntry', { read: ViewContainerRef }) viewEntry: ViewContainerRef;
  @ViewChild('assessTmpl') assessTmpl: TemplateRef<any>;
  @ViewChild('viewTmpl') viewTmpl: TemplateRef<any>;
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;

  @Input('editable') set edit(editable: boolean) {
    if (editable) { this.viewEntry.createEmbeddedView(this.editTmpl); }
    else { this.viewEntry.createEmbeddedView(this.viewTmpl); }
  };

  @Input('recordInfo') set config(recordInfo) {

    if (!recordInfo || !recordInfo.schema) { return; }
    this._store.dispatch(new AssessmentActions.LoadAction({ record: recordInfo.record, schema: recordInfo.schema, referenceId: recordInfo.referenceId, editable: false }));
    this._config();
    this._subscriptions();
  };

  private _config() {
    this.attrSchms$ = this._store
      .select(s => s.assessment.entities.schema.Attributes)

    this.selectedIndex = 0;
    this.selectedIndex$ = this._store.select(s => s.assessment.selectedIndex);
    this.editing$ = this._store.select(s => s.assessment.editing);
    this.attributeAssess$ = this._store
      .select(s => s.assessment.entities.schema.Attributes)
      .switchMap(
      AttrSchms => this.editing$
        .filter(x => x !== undefined)
        .map(value => find(AttrSchms, { _id: value.id }))
      );
  }

  private _subscriptions() {
    this.unsubscriptions.selectedIndexSubs = this.selectedIndex$.subscribe(x => this.selectedIndex = x);
    // cuando no existe nada en evaluación , se crea el assessment
    this.unsubscriptions.isEditingSubs = this.editing$.subscribe(x => {
      if (!x) { return; }
      if (this.assessmentComponent && !this.assessmentComponent.destroyed) { this.assessmentComponent.destroy(); }
      if (this.entry) { this.assessmentComponent = this.entry.createEmbeddedView(this.assessTmpl); }
    });
    if(this.unsubExternalAction){
      this.unsubExternalAction.unsubscribe();
    }
  }

  public output({ message, data }) {
    switch (message) {
      case 'save': this._whenSave(); break;
      case 'cancel': this._whenCancel(); break;
      case 'assess': this._whenAssess(data); break;
      case 'update': this._whenUpdate(data); break;
      // case 'upload': this._whenUpload(data); break;
    }
  }
  private _whenSave() {
    this._store.dispatch(new AssessmentActions.SaveValue());
  }
  private _whenCancel() {
    this._store.dispatch(new AssessmentActions.CancelEvaluation());
  }
  private _whenAssess(data) {
    this._store.dispatch(new AssessmentActions.CancelEvaluation());
    this._store.dispatch(new AssessmentActions.Evaluate(data));
    console.log('DATA', data);

    this._navCtrl.push('AssessAttrPage');
  }
  private _whenUpdate(data) {
    console.log('Update', data);

    this._store.dispatch(new AssessmentActions.UpdateValue(data));
  }
  // private _whenUpload(formData: FormData) {
  //   this._store.dispatch(new UploadActions.LoadAction(formData));
  // }

  @Output('action') action = new EventEmitter<{ message: string, data?: any }>();
  public save() {
    console.log(localStorage.getItem('_id'));
    const updated: IUpdated = { user: localStorage.getItem('_id'), date: (new Date()).toISOString() }
    this.record.updated.push(updated);
    this.action.emit({ message: 'save', data: this.record });
  }
  public cancel() {
    this.action.emit({ message: 'cancel' });
  }

  @Input('external-action') exAction: Observable<{ message: string, data?: any }>;

  ngAfterContentInit() {
    if (this.exAction) {
      this.unsubExternalAction = this.exAction.subscribe(action => {
        if (action.message === 'save') {
          this.save();
          console.log('SAving in external');
          
        }
        if (action.message === 'cancel') {
          this.cancel();
        }
      })
    }
  }

}

// @Component({
//   template: `
//   <ion-header>
//     <ion-navbar>
//       <ion-title>Tabs</ion-title>
//     </ion-navbar>
//   </ion-header>
//   <ion-content></ion-content>
//   `
// })
// class TabsTextContentPage {
//   constructor() {}
// }