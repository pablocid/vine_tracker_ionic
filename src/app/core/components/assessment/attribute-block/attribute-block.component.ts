import { Component, OnInit, AfterContentInit, ComponentRef, OnDestroy, EventEmitter, Input, Output, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { Record, Schema, IAttribute, IAttributeSchema } from '../../../classes';
import { BaseInputComponent } from './inputs/base-input/base-input.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStates, AssessmentActions } from '../../../store';

import {
  SimpleTextComponent,
  SimpleRefComponent,
  SelectionListComponent,
  NumberListComponent,
  MultipleSelectionComponent,
  PictureListComponent
} from './inputs';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'attribute-block, [attribute-block]',
  template: `<span #entry></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeBlockComponent implements OnInit, AfterContentInit, OnDestroy {
  public component: ComponentRef<BaseInputComponent>;

  constructor(
    private _resolver: ComponentFactoryResolver,
    protected _store: Store<AppStates>
  ) { }

  @ViewChild('entry', { read: ViewContainerRef }) entry: ViewContainerRef

  @Input() attrSchm: IAttributeSchema;
  @Input() viewMode: string;
  @Input() editMode: string;
  @Input() editable: boolean;

  ngOnInit() { }

  ngAfterContentInit() { this._configure(); }

  ngOnDestroy() { if (this.component) { this.component.destroy(); } }

  @Output('output') output = new EventEmitter<{ message: string, data?: any }>();

  private _configure() {
    if (!this.attrSchm) { return; }
    const input = this._getListComponentFactoryById(this.attrSchm.Input._id);


    if (!input) { return; }
    this.component = this.entry.createComponent(input);
    this.component.instance.schemaId = this.attrSchm._id;
    this.component.instance.editable = this.editable;
    this.component.instance.editMode = this.editMode;
    this.component.instance.viewMode = this.viewMode;
    this.component.instance.schema$ = this._store.select(s => s.assessment.entities.schema);
    this.component.instance.record$ = this._store.select(s => s.assessment.entities.record);
    this.component.instance.uploading$ = this._store.select(s => s.assessment.uploading);
    this.component.instance.imgInfo$ = this._store.select(s => s.assessment.img)
    this.component.instance.currentImgPath$ = this._store.select(s => s.assessment.img.path);
    this.component.instance.uploadStatus$ = this._store.select(s => s.assessment.uploadStatus);
    this.component.instance.successfullyUploaded$ = this.component.instance.uploadStatus$
      .filter(x => x !== undefined)
      .switchMap(uploadStatus => this.component.instance.currentImgPath$
        .map(currentImgPath => {
          if (!currentImgPath && uploadStatus) {
            return true;
          } else { return false; }
        }));
    this.component.instance.currentIndex$ = this._store.select(s => s.assessment.img.index);

    this.component.instance.output.subscribe(({ message, data }) => {
      switch (message) {
        case 'save': this._whenSave(); break;
        case 'cancel': this._whenCancel(); break;
        case 'assess': this._whenAssess(); break;
        case 'update': this._whenUpdate(); break;
        case 'upload': this._whenUpload(data); break;
        case 'takePicture': this._whenTakePicture(data); break;
      }
    });
  }

  private _whenSave() {
    this.component.destroy();
    this.output.emit({ message: 'save' });
  }
  private _whenCancel() {
    this.component.destroy();
    this.output.emit({ message: 'cancel' });
  }
  private _whenAssess() {
    this.output.emit({ message: 'assess', data: this.attrSchm._id });
  }
  private _whenUpdate() {
    this.output.emit({ message: 'update', data: { id: this.attrSchm._id, [this.component.instance.datatype]: this.component.instance.localValue } });
  }
  private _whenUpload(data) {
    console.log('upload attr block', data.formData.get('file')['name']);
    
    this.output.emit({ message: 'upload', data });
  }
  private _whenTakePicture(data) {
    console.log('private _whenTakePicture(data)  in attribute-block');

    this.output.emit({ message: 'takePicture', data })
  }


  private _getListComponentFactoryById(id: string): ComponentFactory<BaseInputComponent> {
    switch (id) {
      case '57c3202cc8307cd5b82f4465':
        return this._resolver.resolveComponentFactory(SimpleTextComponent);
      case '57c431d5c8307cd5b82f448a':
        return this._resolver.resolveComponentFactory(SimpleRefComponent);
      case '57fe942a45be360010073dbc':
        return this._resolver.resolveComponentFactory(SelectionListComponent);
      case '5808d0fdd48d17001006e43b':
        return this._resolver.resolveComponentFactory(NumberListComponent);
      case '5808dc55832db50010d3192b':
        return this._resolver.resolveComponentFactory(MultipleSelectionComponent);
      case '581a34e95c0eac001077ad6d':
        return this._resolver.resolveComponentFactory(PictureListComponent);
      default:
      //return this._resolver.resolveComponentFactory(SimpleTextComponent);
    }

  }

}
