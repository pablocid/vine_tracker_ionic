import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { IonicPage } from 'ionic-angular';
import {LoginService} from './login.service';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[LoginService]
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private _login:LoginService
  ) { }

  public loading$ = this._login.loading$;
  public response$ = this._login.loginResponse$;

  goTo(){
    this.navCtrl.push('SyncPage', {hola:'Hola parametro skjfkslfjlsdjkf'});
  }

  login(){
    this._login.action({email:"admin@agroinformatica.cl", password:"admin"})
  }
}
