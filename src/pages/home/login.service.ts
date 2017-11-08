import { Injectable } from '@angular/core';
import { AuthActions, AppStates } from '../../app/core/store';
import { Store } from '@ngrx/store';


@Injectable()
export class LoginService {
    public loginResponse$ = this._store.select(state => state.auth);
    public loading$ = this._store.select(state => state.auth.loading);
    constructor(
        private _store: Store<AppStates>
    ) { }

    action(data) {
        this._store.dispatch(new AuthActions.LoginAction(data));
    }

    loginResponse() {
        return this._store.select(state => state.auth)
    }

    loading() {
        return this._store.select(state => state.auth.loading);
    }
}