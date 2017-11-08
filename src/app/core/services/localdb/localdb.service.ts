import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import * as LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
import { LokiFace, LokiCollection, LokiChain } from './loki.interfaces';
import { Observable } from 'rxjs/Observable';
import { find } from 'lodash';
import { IRecord, ISchemaEmbedded, ISchema, IUser } from '../../classes';

@Injectable()
export class LocalDbStoreService {
    public db: LokiFace;
    public records: LokiCollection;
    public schemas: LokiCollection;
    public configs: LokiCollection;
    public users: LokiCollection;

    private _isDbLoaded: boolean;
    constructor(
    ) {
        function LokiPartitioningAdapter(adapter, options?) {
            this.mode = "reference";
            this.adapter = null;
            this.options = options || {};
            this.dbref = null;
            this.dbname = "";
            this.pageIterator = {};

            // verify user passed an appropriate adapter
            if (adapter) {
                if (adapter.mode === "reference") {
                    throw new Error("LokiPartitioningAdapter cannot be instantiated with a reference mode adapter");
                }
                else {
                    this.adapter = adapter;
                }
            }
            else {
                throw new Error("LokiPartitioningAdapter requires a (non-reference mode) adapter on construction");
            }

            // set collection paging defaults
            if (!this.options.hasOwnProperty("paging")) {
                this.options.paging = false;
            }

            // default to page size of 25 megs (can be up to your largest serialized object size larger than this)
            if (!this.options.hasOwnProperty("pageSize")) {
                this.options.pageSize = 25 * 1024 * 1024;
            }

            if (!this.options.hasOwnProperty("delimiter")) {
                this.options.delimiter = '$<-|->';
            }
        }

        LokiPartitioningAdapter.prototype.loadDatabase = function (dbname, callback) {
            var self = this;
            this.dbname = dbname;
            this.dbref = new Loki(dbname, { env: 'NA' });

            // load the db container (without data)
            this.adapter.loadDatabase(dbname, function (result) {
                if (typeof result !== "string") {
                    callback(new Error("LokiPartitioningAdapter received an unexpected response from inner adapter loadDatabase()"));
                }

                // I will want to use loki destructuring helper methods so i will inflate into typed instance
                var db;

                try {
                    self.dbref.loadJSONObject(JSON.parse(result));
                } catch (e) {
                    console.log('No records');
                    
                }

                var clen = self.dbref.collections.length;

                if (self.dbref.collections.length === 0) {
                    callback(self.dbref);
                    return;
                }

                self.pageIterator = {
                    collection: 0,
                    pageIndex: 0
                };

                self.loadNextPartition(0, function () {
                    callback(self.dbref);
                });
            });
        };

        LokiPartitioningAdapter.prototype.loadNextPartition = function (partition, callback) {
            var keyname = this.dbname + "." + partition;
            var self = this;

            if (this.options.paging === true) {
                this.pageIterator.pageIndex = 0;
                this.loadNextPage(callback);
                return;
            }

            this.adapter.loadDatabase(keyname, function (result) {
                var data = self.dbref.deserializeCollection(result, { delimited: true, collectionIndex: partition });
                self.dbref.collections[partition].data = data;

                if (++partition < self.dbref.collections.length) {
                    self.loadNextPartition(partition, callback);
                }
                else {
                    callback();
                }
            });
        };

        LokiPartitioningAdapter.prototype.loadNextPage = function (callback) {
            // calculate name for next saved page in sequence
            var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
            var self = this;

            // load whatever page is next in sequence
            this.adapter.loadDatabase(keyname, function (result) {
                var data = result.split(self.options.delimiter);
                result = ""; // free up memory now that we have split it into array
                var dlen = data.length;
                var idx;

                // detect if last page by presence of final empty string element and remove it if so
                var isLastPage = (data[dlen - 1] === "");
                if (isLastPage) {
                    data.pop();
                    dlen = data.length;
                    // empty collections are just a delimiter meaning two blank items
                    if (data[dlen - 1] === "" && dlen === 1) {
                        data.pop();
                        dlen = data.length;
                    }
                }

                // convert stringified array elements to object instances and push to collection data
                for (idx = 0; idx < dlen; idx++) {
                    //console.log(data[idx])
                    self.dbref.collections[self.pageIterator.collection].data.push(JSON.parse(data[idx]));
                    data[idx] = null;
                }
                data = [];

                // if last page, we are done with this partition
                if (isLastPage) {

                    // if there are more partitions, kick off next partition load
                    if (++self.pageIterator.collection < self.dbref.collections.length) {
                        self.loadNextPartition(self.pageIterator.collection, callback);
                    }
                    else {
                        callback();
                    }
                }
                else {
                    self.pageIterator.pageIndex++;
                    self.loadNextPage(callback);
                }
            });
        };

        LokiPartitioningAdapter.prototype.exportDatabase = function (dbname, dbref, callback) {
            var self = this;
            var idx, clen = dbref.collections.length;

            this.dbref = dbref;
            this.dbname = dbname;

            // queue up dirty partitions to be saved
            this.dirtyPartitions = [-1];
            for (idx = 0; idx < clen; idx++) {
                if (dbref.collections[idx].dirty) {
                    this.dirtyPartitions.push(idx);
                }
            }

            this.saveNextPartition(function (err) {
                callback(err);
            });
        };

        LokiPartitioningAdapter.prototype.saveNextPartition = function (callback) {
            var self = this;
            var partition = this.dirtyPartitions.shift();
            var keyname = this.dbname + ((partition === -1) ? "" : ("." + partition));

            // if we are doing paging and this is collection partition
            if (this.options.paging && partition !== -1) {
                this.pageIterator = {
                    collection: partition,
                    docIndex: 0,
                    pageIndex: 0
                };

                // since saveNextPage recursively calls itself until done, our callback means this whole paged partition is finished
                this.saveNextPage(function (err) {
                    if (self.dirtyPartitions.length === 0) {
                        callback(err);
                    }
                    else {
                        self.saveNextPartition(callback);
                    }
                });
                return;
            }

            // otherwise this is 'non-paged' partioning...
            var result = this.dbref.serializeDestructured({
                partitioned: true,
                delimited: true,
                partition: partition
            });

            this.adapter.saveDatabase(keyname, result, function (err) {
                if (err) {
                    callback(err);
                    return;
                }

                if (self.dirtyPartitions.length === 0) {
                    callback(null);
                }
                else {
                    self.saveNextPartition(callback);
                }
            });
        };

        LokiPartitioningAdapter.prototype.saveNextPage = function (callback) {
            var self = this;
            var coll = this.dbref.collections[this.pageIterator.collection];
            var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
            var pageLen = 0,
                cdlen = coll.data.length,
                delimlen = this.options.delimiter.length;
            var serializedObject = "",
                pageBuilder = "";
            var doneWithPartition = false,
                doneWithPage = false;

            var pageSaveCallback = function (err) {
                pageBuilder = "";

                if (err) {
                    callback(err);
                }

                // update meta properties then continue process by invoking callback
                if (doneWithPartition) {
                    callback(null);
                }
                else {
                    self.pageIterator.pageIndex++;
                    self.saveNextPage(callback);
                }
            };

            if (coll.data.length === 0) {
                doneWithPartition = true;
            }

            while (true) {
                if (!doneWithPartition) {
                    // serialize object
                    serializedObject = JSON.stringify(coll.data[this.pageIterator.docIndex]);
                    pageBuilder += serializedObject;
                    pageLen += serializedObject.length;

                    // if no more documents in collection to add, we are done with partition
                    if (++this.pageIterator.docIndex >= cdlen) doneWithPartition = true;
                }
                // if our current page is bigger than defined pageSize, we are done with page
                if (pageLen >= this.options.pageSize) doneWithPage = true;

                // if not done with current page, need delimiter before next item
                // if done with partition we also want a delmiter to indicate 'end of pages' final empty row
                if (!doneWithPage || doneWithPartition) {
                    pageBuilder += this.options.delimiter;
                    pageLen += delimlen;
                }

                // if we are done with page save it and pass off to next recursive call or callback
                if (doneWithPartition || doneWithPage) {
                    this.adapter.saveDatabase(keyname, pageBuilder, pageSaveCallback);
                    return;
                }
            }
        };

        this.db = new Loki('main.db', {
            adapter: new LokiPartitioningAdapter(new LokiIndexedAdapter(), { paging: true }),
            env: 'BROWSER'
        });

    }

    public loadDatabase() {
        return new Promise((resolve, reject) => {

            if (this._isDbLoaded) {
                resolve(true);
                return;
            }

            if (
                this.db.getCollection('configs') &&
                this.db.getCollection('records') &&
                this.db.getCollection('schemas') &&
                this.db.getCollection('users')
            ) {
                resolve(true);
                return;
            }

            this.db.loadDatabase('', () => {
                try {
                    if (this.db.getCollection('configs')) {
                        this.configs = this.db.getCollection('configs');
                    } else {
                        this.configs = this.db.addCollection('configs', { unique: ['_id'], indices: ['_id'] });
                    }

                    if (this.db.getCollection('users')) {
                        this.users = this.db.getCollection('users');
                    } else {
                        this.users = this.db.addCollection('users', { unique: ['_id'], indices: ['_id'] });
                    }

                    if (this.db.getCollection('records')) {
                        this.records = this.db.getCollection('records')
                    } else {
                        this.records = this.db.addCollection('records', { unique: ['_id'], indices: ['_id'] });
                    }

                    if (this.db.getCollection('schemas')) {
                        this.schemas = this.db.getCollection('schemas');
                    } else {
                        this.schemas = this.db.addCollection('schemas', { unique: ['_id'], indices: ['_id'] });
                    }
                } catch (e) {
                    resolve(false);
                }
                this._isDbLoaded = true;
                resolve(true);
            })
        })
    }

    public async schemasFromLocalDB(search: any) {
        await this.loadDatabase();
        try {
            return this.searchToQuery(this.schemas, search);
        } catch (e) {
            return [];
        }
    }

    public searchToQuery(lokiCollection: LokiCollection, search: any) {

        const query = {
            findQuery: {},
            findArray: []
        }
        Object.keys(search).forEach(x => {
            if (x === 'type' || x === 'schm' || x === 'type') {
                query.findQuery[x] = search[x];
            }
            if (x === 'filter') {
                query.findArray = search[x];
            }
        })

        return lokiCollection.find(query.findQuery).filter(x => {
            let p = true;
            for (var i = 0; i < query.findArray.length; i++) {
                p = x.attributes.some(this.forSome(query.findArray[i]));
                if (!p) { break; }
            }
            return p;
        });

    }

    public forSome(filter) {
        return function (s) {
            return s.id === filter.key && s[filter.datatype] === filter.value;
        }
    }

    public async getSchemaEmbedded(_id: string): Promise<ISchemaEmbedded> {
        await this.loadDatabase();

        const schema = this.schemas.findOne({ _id });

        schema.Attributes = (<any>find(schema.attributes, { id: 'attributes' }))
            .list.map(a => {
                let attr = this.schemas.findOne({ _id: a });
                attr.Input = this.schemas.findOne({ _id: (<any>find(attr.attributes, { id: 'input' })).reference });
                return attr;
            });
        return schema
    }

    public async getBatches(): Promise<IRecord[]> {
        await this.loadDatabase();
        return this.records.find({ schm: '59407b2a9d4e5f0011f6df5c' });
    }

    public async getBatchById(_id: string): Promise<IRecord> {
        await this.loadDatabase();

        return this.records.findOne({ _id, schm: '59407b2a9d4e5f0011f6df5c' });

    }

    public async schemaLength(): Promise<number> {
        await this.loadDatabase();
        try {
            return this.schemas.find().length;
        } catch (e) {
            return 0;
        }
    }

    public async getSchemas(): Promise<ISchema[]> {
        await this.loadDatabase();
        try {
            return this.schemas.find();
        } catch (e) {
            return [];
        }
    }

    public async removeBatches(): Promise<boolean> {
        await this.loadDatabase();
        try {
            const asd = this.records.chain().find({ schm: '59407b2a9d4e5f0011f6df5c' }).remove().data();
            this.db.saveDatabase();
            return true
        } catch (e) {
            return false;
        }
    }

    public async removeSchemas(): Promise<boolean> {
        await this.loadDatabase();
        try {
            const asd = this.schemas.chain().find({}).remove().data();
            this.db.saveDatabase();
            return true
        } catch (e) {
            return false;
        }
    }

    public async insertRecords(records: any[]): Promise<boolean> {
        await this.loadDatabase();
        try {
            this.records.insert(records);
            this.db.saveDatabase();
            return true;
        } catch (e) {
            console.log('Error en insertar records');
            
            return false;
        }
    }

    public async insertSchemas(schemas: any[]): Promise<boolean> {
        await this.loadDatabase();
        try {
            this.schemas.insert(schemas);
            this.db.saveDatabase();
            return true;
        } catch (e) {
            return false;
        }
    }

    /** users */

    public async removeUsers(): Promise<boolean> {
        await this.loadDatabase();
        try {
            this.users.chain().find({}).remove().data();
            this.db.saveDatabase();
            return true
        } catch (e) {
            return false;
        }
    }

    public async insertUsers(users: any[]): Promise<boolean> {
        await this.loadDatabase();
        try {
            this.users.insert(users);
            this.db.saveDatabase();
            return true;
        } catch (e) {
            return false;
        }
    }

    public async getUsers(): Promise<IUser[]> {
        await this.loadDatabase();
        return this.users.find({});
    }

    public async getUsersLength(): Promise<number> {
        await this.loadDatabase();
        const users = this.users.find({});
        return users.length;
    }

    public async getUserById(_id: string): Promise<IUser> {
        await this.loadDatabase();
        return this.users.findOne({ _id });
    }

}