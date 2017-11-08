import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as auth from './auth.actions';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthEffects {
  constructor(
    private authService: AuthService,
    private actions$: Actions
  ) { }

  @Effect() get$ = this.actions$
    .ofType(auth.LOGIN)
    .map(toPayload)
    .switchMap(payload => this.authService.get(payload.email, payload.password)
      .map(res => new auth.LoginSuccessAction(res))
      .catch((x) => Observable.of(new auth.LoginFailAction(x)))
    );
  @Effect() toLogin$ = this.actions$
    .ofType(auth.SESSION_EXPIRED)
    .map(x => new auth.LoginFailAction('La sesión ha expirado'))
    .map(x => this.authService.redirectToLoginPage())
    .map(x => new auth.RedirectToLoginAction())
}