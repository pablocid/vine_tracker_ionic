import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
  styles: [`
  img {
      width: auto;
      height: auto;
      max-height:700px;
  }
`]
})
export class ModalPage {
  public title:string;
  public url:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,  private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  ionViewWillLoad() {
    this.title = this.navParams.get('title');
    this.url = this.navParams.get('url');
  }

  closeModal() {
    this.view.dismiss();
  }

}
