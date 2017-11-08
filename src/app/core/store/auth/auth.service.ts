import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../../services/backend/backend.service';

@Injectable()
export class AuthService {

  constructor(
    private _backend: BackendService,
    private _app:App
  ) { }

  get(email, password): Observable<any> {
    return this._backend.login(email, password)
      .map(x => this.setTokenToLocalStorage(x.token))
      .switchMap(() => this.setCurrentUserInfo())
  }

  setTokenToLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  setUserInfoToLocalStorage(info: any) {
    for (let key in info) {
      localStorage.setItem(key, info[key]);
    }
  }

  getCurrentUserInfo() {
    return this._backend.currentUser();
  }

  setCurrentUserInfo() {
    return this.getCurrentUserInfo()
    .map(x => this.setUserInfoToLocalStorage(x))
    .catch(x=>{
      throw x;
    });
  }

  redirectToLoginPage(){
    this._app.getActiveNav().setRoot('HomePage');
  }
}