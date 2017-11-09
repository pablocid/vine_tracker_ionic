import * as auth from './auth.actions';

export interface AuthState {
  loading: boolean;
  isLoggin: boolean;
  errorMessage: string;
  entities: { [id: string]: any };
  result: string[];
}

export const initialState: AuthState = {
  loading: false,
  isLoggin: false,
  errorMessage: '',
  entities: {},
  result: []
}

export function AuthReducer(state = initialState, action: auth.Actions): AuthState {
  switch (action.type) {
    case auth.LOGIN: {
      return { ...state, loading: true, errorMessage: '' }
    }

    case auth.LOGIN_SUCCESS: {

      return { ...state, loading: false, isLoggin: true, errorMessage: '' };
    }

    case auth.LOGIN_FAIL: {

      return { ...state, loading: false, errorMessage: action.payload, isLoggin: false };
    }

    case auth.SESSION_EXPIRED: {
      return { ...state, isLoggin: false, errorMessage: 'Tu sesión ha expirado' }
    }

    case auth.REDIRECT_TO_LOGIN: {

      return state;
    }

    case auth.LOGOUT: {
      removeToken();
      return state;
    }

    default: {
      return state;
    }
  }
}

function removeToken() {
  console.log('erasing the token');
  
  localStorage.setItem('token', '');
}