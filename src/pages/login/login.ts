import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginService } from './login.service';
import { LoadingController, Loading } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage implements OnInit, OnDestroy {
  public loading$ = this._service.loading$;
  public response$ = this._service.loginResponse$;
  public isLoggin$ = this.response$.map(x => x.isLoggin);
  private _ling: Loading;
  private _unLoading: Subscription;
  public email: string = localStorage.getItem('email');
  public password: string //= "admin";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: LoginService,
    public loadingCtrl: LoadingController
  ) {
    this._ling = this.loadingCtrl.create({ content: "login ..." })
  }

  ngOnInit() {
    this._unLoading = this._service.loading$.subscribe(x => {
      if (x) { this._ling.present(); }
      else { this._ling.dismissAll(); }
    });
  }

  ngOnDestroy() {
    if (this._unLoading) { this._unLoading.unsubscribe(); }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    //this._service.action({ email: "admin@agroinformatica.cl", password: "admin" })
    localStorage.setItem('email', this.email);
    this._service.action({ email: this.email, password: this.password })
    this.password = '';
  }

  goHome() {
    this.navCtrl.setRoot("HomePage");
  }

}
