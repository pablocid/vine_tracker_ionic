import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SESSION_EXPIRED = '[Auth] SessionExpired';
export const REDIRECT_TO_LOGIN = '[Auth] RedirectToLogin';

export const CHECK_LOGIN = '[Auth] Check Login';
export const CHECK_LOGIN_SUCCESS = '[Auth] Check Login Success';
export const CHECK_LOGIN_FAIL = '[Auth] Check Login Fail';

export const LOGOUT = '[Auth] Logout';
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

export class CheckLoginAction implements Action {
  readonly type = CHECK_LOGIN;
  constructor(public payload?: any) { }
}

export class CheckLoginSuccessAction implements Action {
  readonly type = CHECK_LOGIN_SUCCESS;

  constructor(public payload: any) { }
}

export class CheckLoginFailAction implements Action {
  readonly type = CHECK_LOGIN_FAIL;

  constructor(public payload: any) { }
}

export class LogOUTAction implements Action {
  readonly type = LOGOUT;
}
export type Actions =
  | LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | SesssionExpiredAction
  | RedirectToLoginAction
  | CheckLoginAction
  | CheckLoginSuccessAction
  | CheckLoginFailAction
  | LogOUTAction
  ;

export const AuthActionTokens = {
  LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, SESSION_EXPIRED, REDIRECT_TO_LOGIN,
  CHECK_LOGIN, CHECK_LOGIN_SUCCESS, CHECK_LOGIN_FAIL, LOGOUT
};
export const AuthActions = {
  LoginAction, LoginSuccessAction, LoginFailAction, SesssionExpiredAction, RedirectToLoginAction,
  CheckLoginAction, CheckLoginSuccessAction, CheckLoginFailAction, LogOUTAction
};