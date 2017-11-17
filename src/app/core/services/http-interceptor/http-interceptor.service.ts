import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LocalDbStoreService } from '../localdb/localdb.service';
import { Store} from '@ngrx/store';
import { AppStates, AuthActions } from '../../store';

@Injectable()
export class AuthenticatedHttpService extends Http {

    constructor(
        backend: XHRBackend,
        defaultOptions: RequestOptions,
        private _ldbs: LocalDbStoreService,
        private _store :Store<AppStates>
    ) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        console.log('Http requeest intercepted');
        //console.log('TOken', this._token);

        this._setHeader(url, options, this._token);
        return super.request(url, options)
            .catch((error: Response) => {
                if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
                    console.log('The authentication session expires or the user is not authorised. Redirect to page.');
                    this._store.dispatch(new AuthActions.SesssionExpiredAction());
                }
                //console.log('Error status', error);

                if (error.status >= 500 && error.status < 600) {
                    console.log('Error de comunicación con el servidor: ' + typeof error.status)
                }

                if (error.status === 0) {
                    alert('Sin conexión a internet');
                }
                return Observable.throw(error);
            });
    }

    private get _token() {
        return localStorage.getItem('token');
    }

    private _setHeader(url: string | Request, options: RequestOptionsArgs, token: string) {
        if (typeof url === 'string') {
            if (!options) { options = {}; }
            if (!options.headers) { options.headers = new Headers(); }
            options.headers.append('Authorization', `Bearer ${token}`)
        } else {
            url.headers.append('Authorization', `Bearer ${token}`);
            url.withCredentials = false;
        }
        //console.log('URL', url);



    }
}

/*
 Status 200 : 'Success',
   
  Status 201 : 'Created',
        
  Status 202 : 'Accepted',
        
  Status 203 : 'Non-Authoritative Information',
        
  Status 204 : 'No Content',
        
  Status 205 : 'Reset Content',
        
  Status 206 : 'Partial Content',
        
  Status 300 : 'Multiple Choices',
        
  Status 301 : 'Moved Permanently',
        
  Status 302 : 'Found',
        
  Status 303 : 'See Other',
        
  Status 304 : 'Not Modified',
        
  Status 305 : 'Use Proxy',
        
  Status 307 : 'Temporary Redirect',
        
  Status 400 : 'Bad Request',
        
  Status 401 : 'Unauthorized',
        
  Status 402 : 'Payment Required',
        
  Status 403 : 'Forbidden',
        
  Status 404 : 'Not Found',
        
  Status 405 : 'Method Not Allowed',
        
  Status 406 : 'Not Acceptable',
        
  Status 407 : 'Proxy Authentication Required',
        
  Status 408 : 'Request Timeout',
        
  Status 409 : 'Conflict',
        
  Status 410 : 'Gone',
        
  Status 411 : 'Length Required',
        
  Status 412 : 'Precondition Failed',
        
  Status 413 : 'Request Entity Too Large',
        
  Status 414 : 'Request-URI Too Long',
        
  Status 415 : 'Unsupported Media Type',
        
  Status 416 : 'Requested Range Not Satisfiable',
        
  Status 417 : 'Expectation Failed',
        
  Status 500 : 'Internal Server Error',
        
  Status 501 : 'Not Implemented',
        
  Status 502 : 'Bad Gateway',
        
  Status 503 : 'Service Unavailable',
        
  Status 504 : 'Gateway Timeout',
        
  Status 505 : 'HTTP Version Not Supported'
*/