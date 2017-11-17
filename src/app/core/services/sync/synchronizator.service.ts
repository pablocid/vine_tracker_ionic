import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { LocalDbStoreService } from '../localdb/localdb.service';
import { max, flatten } from 'lodash';

@Injectable()
export class SynService {

    constructor(
        private _bs: BackendService,
        private _ldb: LocalDbStoreService
    ) { }

    public getLastDateFromRemoteSchm(): Promise<Date> {
        const query = [
            { "$unwind": "$updated" },
            { "$sort": { "updated.date": -1 } },
            { "$limit": 1 },
            { "$project": { "date": "$updated.date" } }
        ];
        return this._bs.findAggregateSchemas(query).then(x => new Date(x[0].date));
    }
    public getLastDateFromRemoteBatchRecords(): Promise<Date> {
        const query = [
            { "$match": { "schm": { "$oid": "59407b2a9d4e5f0011f6df5c" } } },
            { "$unwind": "$updated" },
            { "$sort": { "updated.date": -1 } },
            { "$limit": 1 },
            { "$project": { "date": "$updated.date" } }
        ];
        return this._bs.findAggregateRecords(query).then(x => new Date(x[0].date));
    }

    public async getLastDateFromLocalSchm(): Promise<Date> {
        const length = await this._ldb.schemaLength();
        if (!length) { return null; }

        const coll = this._ldb.schemas.find();
        const date = max(flatten(coll.map(x => x.updated.map(s => s.date))));

        return date ? new Date(date) : null;

    }
    public async getLastDateFromLocalBatchRecords(): Promise<Date> {
        const batches = await this._ldb.getBatches();
        if (!batches.length) { return null; }

        const coll = this._ldb.records.find({ schm: "59407b2a9d4e5f0011f6df5c" });
        console.log('Collection batches', coll);

        const date = max(flatten(coll.map(x => x.updated.map(s => s.date))));

        return date ? new Date(date) : null;

    }

    public async compareSchmDates(): Promise<{ remoteDate: Date, localDate: Date, isEqual: boolean }> {
        const remoteDate = await this.getLastDateFromRemoteSchm();
        const localDate = await this.getLastDateFromLocalSchm();

        let isEqual;
        if (remoteDate && localDate && remoteDate.toISOString() === localDate.toISOString()) { isEqual = true; } else { isEqual = false; }
        return { remoteDate, localDate, isEqual }
    }

    public async compareBatchDates(): Promise<{ remoteDate: Date, localDate: Date, isEqual: boolean }> {
        const remoteDate = await this.getLastDateFromRemoteBatchRecords();
        const localDate = await this.getLastDateFromLocalBatchRecords();

        let isEqual;
        if (remoteDate && localDate && remoteDate.toISOString() === localDate.toISOString()) { isEqual = true; } else { isEqual = false; }
        return { remoteDate, localDate, isEqual }
    }

    public async syncBatchRecords(): Promise<boolean> {
        const isRemove = await this._ldb.removeBatches();
        if (!isRemove) { return; }
        const batches = await this._bs.getBatches();
        console.log('get batches', batches);
        //return false
        return this._ldb.insertRecords(batches);
    }

    public async syncSchemas(): Promise<boolean> {
        const isRemove = await this._ldb.removeSchemas();
        if (!isRemove) { return; }
        const batches = await this._bs.getSchemas();
        return this._ldb.insertSchemas(batches);
    }

    public async getBatchesInfo() {
        const batches = await this._ldb.getBatches();
        const length = batches.length;
        const compare = await this.compareBatchDates()
        return { length, ...compare }
    }

    public async getSchemaInfo() {
        const length = await this._ldb.schemaLength();
        const compare = await this.compareSchmDates();
        return { length, ...compare };
    }

    public getUsers() {
        return this._bs.getUsers();
    }


    public async getUsersInfo() {
        const length = await this._ldb.getUsersLength();
        const users = await this._ldb.getUsers();
        return { length, users };
    }

    public async syncUsers() {
        await this._ldb.removeUsers();
        const users = await this._bs.getUsers();
        return this._ldb.insertUsers(users);
    }

}