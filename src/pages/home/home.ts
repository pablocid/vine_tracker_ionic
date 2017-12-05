import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { LoginService } from '../login/login.service';
import { LoadingController, Loading } from 'ionic-angular';
import { ActionSheetController, ActionSheet, Platform } from 'ionic-angular';
import { HomeService } from './home.service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LoginService, HomeService]
})
export class HomePage implements OnInit, OnDestroy {
  public actionSheet: ActionSheet;
  public syncActionSheet: ActionSheet;
  private unCheckLoading: Subscription;
  private unIsUp: Subscription;
  private _loading: Loading;
  private _checked: boolean = false;

  constructor(
    public navCtrl: NavController,
    private _logServ: LoginService,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private _service: HomeService,
    public loadingCtrl: LoadingController,
    private _app: App
  ) {
    //this.check();

  }

  presentActionSheet() {
    this.actionSheet.present();
  }

  private presentLoading() {
    this._loading = this.loadingCtrl.create({
      content: "revisando actualizaciones disponibles ...",
      duration: 3000
    });
    this._loading.present();
  }

  private dismissLoading() {
    if (this._loading) {
      this._loading.dismiss();
      this._loading = undefined;
    }
  }

  presentSyncSheet() {
    this.syncActionSheet = this.actionSheetCtrl.create({
      title: 'Sincronización',
      buttons: [
        {
          text: 'Ir al sincronizador',
          role: 'logout',
          icon: 'sync',
          handler: () => {
            this.navCtrl.push('SyncPage')
            //alert('Debes sincronizar')
          }
        }
      ]
    });
    this.syncActionSheet.present();
  }
  dissmissSyncCheet() {
    if (this.syncActionSheet) { this.syncActionSheet.dismiss(); this.syncActionSheet = undefined; }
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



    this.unCheckLoading = this._service.checkLoading$.subscribe(x => {
      console.log('checking loading', x);

      if (x) { this.presentLoading(); }
      else { this.dismissLoading(); }
    });

    this.unIsUp = this._service.isUp$.subscribe(up => {
      if (up) {
        console.log('Is updated');
        this.dissmissSyncCheet()
      }
      else {
        if (!this._checked) { this.presentSyncSheet(); }
        this._checked = true;
      }
    });


    this._service.checkSync();

  }

  ngOnDestroy() {
    if (this.unCheckLoading) { this.unCheckLoading.unsubscribe(); }
    if (this.unIsUp) { this.unIsUp.unsubscribe(); }
    this.dismissLoading();
    this.dissmissSyncCheet();
  }

  goTo(page: string) {
    this.navCtrl.push(page, { hola: 'Hola parametro skjfkslfjlsdjkf' });
  }

  check() {
    this._logServ.checkLogin();
  }

}
