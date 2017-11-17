import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AssessAttrService } from './assess-attr.service';
import {find} from 'lodash';
/**
 * Generated class for the AssessAttrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assess-attr',
  templateUrl: 'assess-attr.html',
  providers: [AssessAttrService]
})
export class AssessAttrPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: AssessAttrService
  ) {
  }
  public attributeAssess$ = this._service.attributeAssess$;
  public editing$ = this._service.editing$;
  public attr$ = this._service.attr$;
  public attrName$ = this.attributeAssess$.map(x => {
    try {
      return find(x.attributes, {id:'label'})['string'];
    } catch (e) {
      return '';
    }
  })

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssessAttrPage');
  }

  output($event: { message: string, data: any }) {
    console.log('$event', $event);
    if ($event.message === 'save') {
      console.log('Saving attr....');
      this.navCtrl.pop();
      this._service.save();

    }

    if ($event.message === 'cancel') {
      console.log('canceliing attr ...');
      this._service.cancel();
      this.navCtrl.pop();
    }

    if ($event.message === 'update') {
      this._service.update($event.data);
    }

    if ($event.message === 'upload') {
      this._service.uploadImage($event.data);
    }

    if ($event.message === 'takePicture') {
      console.log('takePicture in assess-attr');
      
      this._service.takePicture($event.data);
    }

    //this.redirect();
  }

}
