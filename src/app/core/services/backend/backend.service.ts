import { Injectable } from '@angular/core';
import { Http, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IRecord } from '../../classes';
import 'rxjs/add/operator/toPromise';

import { File as FileNative } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

@Injectable()
export class BackendService {
    private urlBase = 'https://pmg-restful-dev.herokuapp.com';
    private _urlUsers: string = `${this.urlBase}/api/users`;
    private _urlSchemas: string = `${this.urlBase}/api/schemas/stream`;
    private _urlRecordsStream: string = `${this.urlBase}/api/records/stream`;
    private _urlRecords: string = `${this.urlBase}/api/records`;
    private _urlRecordsAggregate: string = `${this.urlBase}/api/records/aggregate`;
    private _urlSchemasAggregate: string = `${this.urlBase}/api/schemas/aggregate`;
    private _urlAuth: string = `${this.urlBase}/auth/local`;
    private _urlCurrentUser: string = `${this.urlBase}/api/users/me`;
    private _urlUploads: string = `${this.urlBase}/api/uploads`;

    constructor(
        private _http: Http,
        private transfer: Transfer,
    ) { }

    public saveRecord(record: IRecord, isNew): Observable<any> {

        if (isNew) {
            console.log('Es un registro nuevo');
            return this._saveNewRecordToServerObservable(this._urlRecords, record);
        } else {
            console.log('Es un registro antiguo', { url: `${this._urlRecords}/${record._id}` }, record);
            return this._updateRecordToServerObservable(`${this._urlRecords}/${record._id}`, record);
        }
    }

    public findSchemas(search) {
        return this._docsFromServer(this._urlSchemas, search).catch(x => { throw x });
    }

    public getBatches() {
        const search = { schm: '59407b2a9d4e5f0011f6df5c' }
        return this._docsFromServer(this._urlRecordsStream, search)
    }

    public getSchemas() {
        return this._docsFromServer(this._urlSchemas, {})
    }

    public getUsers(): Promise<any[]> {
        return this._docsFromServer(this._urlUsers, {});
    }

    public schemas(search) {
        return this._docsFromServerObservable(this._urlSchemas, search)
    }

    public findRecords(search: any) {
        return this._docsFromServer(this._urlRecordsStream, search);
    }

    public findOneRecordBySearch(search: any): Promise<any> {
        return this._docsFromServer(this._urlRecordsStream, search).then(x => {
            if (x && x.length) { return x[0]; }
            return;
        });
    }

    public findOneRecordBySearchObservable(search: any): Observable<any> {
        return this._docsFromServerObservable(this._urlRecordsStream, search).map(x => {
            if (x && x.length) { return x[0]; }
            return;
        });
    }

    public findOneRecordById(id: any) {
        return this._docsFromServer(`${this._urlRecords}/${id}`, null);
    }

    public async findOneRecordByIdStream(id: any) {
        const query = [
            { $match: { _id: { $oid: id } } }
        ]
        const response = await this.findAggregateRecords(query);
        return response[0];
    }

    public findAggregateRecords(query: any[]): Promise<any[]> {
        return this._docsFromServer(this._urlRecordsAggregate, { query: JSON.stringify(query) })
    }

    public findAggregateRecordsObservable(query: any[]): Observable<any[]> {
        return this._docsFromServerObservable(this._urlRecordsAggregate, { query: JSON.stringify(query) })
    }

    public findAggregateSchemas(query: any[]): Promise<any[]> {
        return this._docsFromServer(this._urlSchemasAggregate, { query: JSON.stringify(query) })
    }

    public findAggregateSchemasObservable(query: any[]): Observable<any[]> {
        return this._docsFromServerObservable(this._urlSchemasAggregate, { query: JSON.stringify(query) })
    }

    public login(email: string, password: string) {
        return this._http.post(this._urlAuth, { email, password })
            .map(x => x.json());
    }

    public currentUser() {
        return this._http.get(this._urlCurrentUser)
            .map(x => x.json())
    }

    public upload(formData) {
        return this._http.post(this._urlUploads, formData);
    }

    private async _docsFromServer(url, search) {
        const requestArgs = {
            search: this._searchToString(search),
            method: RequestMethod.Get,
            contentType: ResponseContentType.Json,
        }
        return await this._http.get(url, requestArgs).map(x => {
            try { return x.json(); }
            catch (e) { return []; }
        }).toPromise();
    }

    // private async _saveNewRecordToServer(url: string, data: any) {
    //     return await this._http.post(url, data).map(x => {
    //         try { return x.json(); }
    //         catch (e) { return {}; }
    //     }).toPromise();
    // }

    private _saveNewRecordToServerObservable(url: string, data: any) {
        return this._http.post(url, data).map(x => {
            try { return x.json(); }
            catch (e) { return {}; }
        });
    }

    // private async _updateRecordToServer(url: string, data: any) {
    //     return await this._http.put(url, data).map(x => {
    //         try { return x.json(); }
    //         catch (e) { return {}; }
    //     }).toPromise();
    // }

    private _updateRecordToServerObservable(url: string, data: any) {
        return this._http.put(url, data).map(x => {
            try {
                console.log('x.json()', x.json());

                return x.json();
            }
            catch (e) {
                console.log('ERROR', e);

                return {};
            }
        });
    }

    private _docsFromServerObservable(url, search) {
        const requestArgs = {
            search: this._searchToString(search),
            method: RequestMethod.Get,
            contentType: ResponseContentType.Json,
        }
        return this._http.get(url, requestArgs).map(x => x.json());
    }

    private _searchToString(value: any): string {
        if (!value) { return ''; }
        return Object.keys(value)
            .map(x => {
                if (typeof value[x] === 'string') {
                    return `${x}=${value[x]}`
                }
                else {
                    try {
                        return `${x}=${JSON.stringify(value[x])}`;
                    } catch (e) {

                    }
                }
            })
            .join('&')
    }

    public uploadImage(path, filename): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var options: FileUploadOptions = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: { 'fileName': filename },
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            };

            const fileTransfer: TransferObject = this.transfer.create();

            // Use the FileTransfer to upload the image
            this.transfer.create().upload(path, this._urlUploads, options).then(data => {
                console.log('UPLOADEDDDDD');

                resolve(true);
            }, err => {
                console.log(err)
                reject(false);
            });
        })
    }

}