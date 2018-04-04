import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IRecordInfo, IRecord, ISchemaEmbedded } from '../../app/core/classes/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ priority: 'low' })
@Component({
  selector: 'asses-info-page-modal',
  templateUrl: 'assess-info.html',
  styles: [`
  img {
      width: auto;
      height: auto;
      max-height:700px;
  }
`]
})
export class AssessInfoModalPage {
  public title: string;
  public url: string;
  public recordInfo$: Observable<IRecordInfo>;
  public record$: Observable<IRecord>;
  public schema$: Observable<ISchemaEmbedded>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  ionViewWillLoad() {
    this.recordInfo$ = this.navParams.get('recordInfo$');
    console.log('this.recordInfo$', this.recordInfo$);
    
    this.record$ = this.recordInfo$.map(x => x.record);
    this.schema$ = this.recordInfo$.map(x => x.schema);
  }

  closeModal() {
    this.view.dismiss();
  }

}
