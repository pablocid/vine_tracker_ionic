import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SESSION_EXPIRED = '[Auth] SessionExpired';
export const REDIRECT_TO_LOGIN = '[Auth] RedirectToLogin';

/**
 * Load Auth Actions
 */

 export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(public payload: any) { }
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: any) { }
}

export class LoginFailAction implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: any) { }
}

export class SesssionExpiredAction implements Action {
  readonly type = SESSION_EXPIRED;
}

export class RedirectToLoginAction implements Action {
  readonly type = REDIRECT_TO_LOGIN;
}

export type Actions =
  | LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | SesssionExpiredAction
  | RedirectToLoginAction;

export const AuthActionTokens = { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL,SESSION_EXPIRED, REDIRECT_TO_LOGIN };
export const AuthActions = { LoginAction, LoginSuccessAction, LoginFailAction, SesssionExpiredAction, RedirectToLoginAction };