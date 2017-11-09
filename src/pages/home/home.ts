import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { LoginService } from '../login/login.service';

import { ActionSheetController, ActionSheet, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LoginService]
})
export class HomePage implements OnInit {
  public actionSheet: ActionSheet;

  constructor(
    public navCtrl: NavController,
    private _logServ: LoginService,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
  ) {
    //this.check();
  }

  presentActionSheet() {
    this.actionSheet.present();
  }

  ngOnInit() {
    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Menu',
      buttons: [
        {
          text: 'Logout',
          role: 'logout',
          icon: 'log-out',
          handler: () => {
            this._logServ.logOut();
            //this.navCtrl.push('LoginPage');
            this.navCtrl.setRoot('LoginPage')
          }
        },
        {
          text: 'Login',
          role: 'login',
          icon: 'log-in',
          handler: () => {
            //this.navCtrl.push('LoginPage');
            this.navCtrl.setRoot('LoginPage');
          }
        }
      ]
    });
  }

  goTo(page: string) {
    this.navCtrl.push(page, { hola: 'Hola parametro skjfkslfjlsdjkf' });
  }

  check() {
    this._logServ.checkLogin();
  }

}
