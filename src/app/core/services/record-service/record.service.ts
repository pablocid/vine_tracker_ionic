import { Injectable } from '@angular/core';
import { BackendService, LocalDbStoreService } from '../index';
import { IRecord, ISchemaEmbedded, IRecordInfo, ISchema } from '../../classes';
import { find } from 'lodash';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RecordService {
    private _dbg: boolean = true;

    constructor(
        private _bs: BackendService,
        private _ldb: LocalDbStoreService,
    ) { }

    public async getRecordInfoById(_id): Promise<IRecordInfo> {
        const record = await this._bs.findOneRecordById(_id).then(x => x.record);
        const schema = await this._ldb.getSchemaEmbedded(record.schm);
        return { record, schema };
    }

    public getRecordBySchemaAndReference(schemaId: string, referenceId: string): Promise<IRecord> {
        return this._bs.findOneRecordBySearch({ schm: schemaId, filter: [{ key: "57c42f77c8307cd5b82f4486", value: referenceId, datatype: "reference" }] })
    }

    public getRecordBySchemaAndReferenceObservable(schemaId: string, referenceId: string): Observable<IRecord> {
        return this._bs.findOneRecordBySearchObservable({ schm: schemaId, filter: [{ key: "57c42f77c8307cd5b82f4486", value: referenceId, datatype: "reference" }] })
    }

    public async getBatchByRecord(record: IRecord): Promise<IRecord> {
        const batches = await this._ldb.getBatches();
        if (!batches || batches.length === 0) { return; }

        //594079be9d4e5f0011f6df5b batch filter
        let b = [];
        for (let batch of batches) {

            let attr = find(batch.attributes, { id: '594079be9d4e5f0011f6df5b' });
            if (!attr || !attr.string) { continue; };
            let filters;
            try { filters = JSON.parse(attr.string) } catch (e) { console.log(e); continue; }

            let ok: boolean = true;
            try {
                for (let filter of filters) {
                    const exist = find(record.attributes, { id: filter.key, [filter.datatype]: filter.value })
                    console.log(exist)
                    if (!exist) { ok = false }
                }
            } catch (e) { console.log(e); continue; }
            if (ok) {
                b.push(batch);
            }
        }
        if (!b || b.length === 0) {
            throw { message: 'no existen lotes que coincidan con el individuo', error: true }
        }
        return b[0];
    }

    public getAssessments(batch: IRecord): Promise<ISchemaEmbedded[]> {
        let list: string[];
        try { list = (<string[]>(find(batch.attributes, { id: '598a254211e3cf0011f5d819' })).list); }
        catch (e) {
            throw { message: 'no se pudo obter información sobre las evaluaciones', error: true }
        }

        if (!list || list.length === 0) { throw { message: 'no existen evaluaciones asociadas al este grupo/lote', error: true }; }

        return Promise.all(list.map(x => this._ldb.getSchemaEmbedded(x)));
    }

    public getRecordInfoByPosition(espaldera: number, hilera: number, posicion: number): Observable<IRecordInfo> {
        const search = {
            schm: "57a4e02ec830e2bdff1a1608",
            filter: [
                { key: '5807af5f31f55d0010aaffe4', value: espaldera, datatype: "number" },
                { key: '5807af9231f55d0010aaffe5', value: hilera, datatype: "number" },
                { key: '5807afe331f55d0010aaffe6', value: posicion, datatype: "number" }
            ]
        };

        return this._bs
            .findOneRecordBySearchObservable(search)
            .switchMap(record =>
                Observable
                    .fromPromise(this._ldb.getSchemaEmbedded(record.schm))
                    .map(schema => {
                        return { record, schema };
                    })
            )
    }

    public getRecordInfoByCode(code: string): Observable<IRecordInfo> {
        if (!/^[0-9a-f]{24}$/i.test(code)) {
            const search = {
                schm: '57a4e02ec830e2bdff1a1608',
                filter: [
                    { key: '57c3583bc8307cd5b82f447d', value: code, datatype: 'string' }
                ]
            }

            return this._bs
                .findOneRecordBySearchObservable(search)
                .switchMap(record =>
                    Observable
                        .fromPromise(this._ldb.getSchemaEmbedded(record.schm))
                        .map(schema => {
                            return { record, schema };
                        })
                )
        }else{
            return this._bs
            .findOneRecordByIdObserable(code)
            .switchMap(record =>
                Observable
                    .fromPromise(this._ldb.getSchemaEmbedded(record.schm))
                    .map(schema => {
                        return { record, schema };
                    })
            )
        }

    }

    public distinctSubBatchNumbers(streamQuery: string, typeId: string, dd: string) {
        streamQuery = "schm=57a4e02ec830e2bdff1a1608&filter=[{\"key\":\"5807af5f31f55d0010aaffe4\",\"value\":5,\"datatype\":\"number\"}]";
        typeId = '5807af9231f55d0010aaffe5';
        dd = 'number';

        let query = { schm: null, filter: [] };

        for (var s in streamQuery.split('&')) {
            if (streamQuery.split('&').hasOwnProperty(s)) {
                var element = streamQuery.split('&')[s];
                const key = element.split('=')[0];
                const value = element.split('=')[1];
                if (key === 'schm') {
                    query[key] = value;
                }
                if (key === 'filter') {
                    query[key] = JSON.parse(value);
                }
            }
        }

        let matches = [];
        query.filter.forEach(x => {
            matches.push({ $match: { attributes: { $elemMatch: { id: x.key, [x.datatype]: x.value } } } });
        });

        const aggreQuery = [
            { $match: { schm: { $oid: query.schm } } },
            ...matches,
            {
                $project: {
                    "field": {
                        $filter: {
                            input: "$attributes",
                            as: "attr",
                            cond: { $eq: ["$$attr.id", typeId] }
                        }
                    }
                }
            },
            {
                $unwind: "$field"
            },
            {
                $group: { _id: `$field.${dd}` }
            },
            {
                $sort: { _id: 1 }
            }
        ];

        return this._bs.findAggregateRecordsObservable(aggreQuery).map(x => x.map(x => x._id));
    }

    public async  getRestrictionAggregateQueryFromSchema(schemaId: string): Promise<any[]> {
        const schema = await this._ldb.getSchemaEmbedded(schemaId);
        const restriction = find(schema.attributes, { id: 'restriction' });
        if (!restriction || !Array.isArray(restriction['listOfObj']) || !restriction['listOfObj'].length) {
            return [];
        }

        return restriction['listOfObj'].map(x => {
            if (x.id === 'schm') {
                return { $match: { schm: { $oid: x.string } } };
            }

            if (x.id === 'filter') {
                let string = x.string.split('|').map((s, i) => {
                    if (i === 1) {
                        return JSON.parse(s);
                    }
                    return s
                });
                return { $match: { "attributes": { $elemMatch: { id: string[0], [string[2]]: string[1] } } } }
            }

        });
    }

    public async getRecordByRestrictions(schema: any, filter: any[]): Promise<{ isRestricted: boolean, allowedRecords: IRecord[], schema: ISchemaEmbedded }> {
        const schemaEmbedded = await this._ldb.getSchemaEmbedded(schema._id);
        let restrictions;
        let isRestricted = false;

        if (find(schemaEmbedded.attributes, { id: 'restriction' })) {
            restrictions = await this.getRestrictionAggregateQueryFromSchema(schema._id);
            isRestricted = true;
        } else {
            return {
                isRestricted,
                allowedRecords: [],
                schema: null
            }
        }
        const query = [
            ...restrictions,
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1,
                    reference: {
                        $filter: {
                            input: '$attributes',
                            as: "attr",
                            cond: { $eq: ['$$attr.id', "57c42f77c8307cd5b82f4486"] } //reference attribute
                        }
                    }
                }
            },
            { $unwind: "$reference" },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: "$reference.reference"
                }
            },
            {
                $lookup: {
                    from: "records",
                    localField: "reference",
                    foreignField: "_id",
                    as: "plant"
                }
            },
            { $unwind: "$plant" },
            {
                $match: {
                    $and: filter.map(x => {
                        return { "plant.attributes": { $elemMatch: { id: x.key, [x.datatype]: x.value } } }
                    })
                }
            },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: 1
                }
            }
        ]

        const allowedRecords = await this._bs.findAggregateRecords(query);
        return {
            isRestricted,
            allowedRecords,
            schema: null
        }
    }

    public async getSubBatchData(assessmentId: string, batchId: string, subBatchFilter: string):
        Promise<{
            schema: ISchemaEmbedded,
            schemaRef: ISchemaEmbedded,
            batch: IRecord,
            subBatchFilter: any,
            data: { record: IRecord, reference: IRecord, restricted: boolean }[]
        }> {
        //console.log('Arguments', assessmentId, batchId, subBatchFilter);
        const batch = await this._ldb.getBatchById(batchId);
        const assessSchm = await this._ldb.getSchemaEmbedded(assessmentId);

        console.log('assessSchm', assessSchm);
        if (!batch || !assessSchm) {
            console.log('ERROR: batch or assessSchm is undefined');

            return;
        }

        const batchRefSchmId = find(batch.attributes, { id: '594079169d4e5f0011f6df5a' })['reference'];

        const batchRefSchm = await this._ldb.getSchemaEmbedded(batchRefSchmId);

        const batchRefFilter = this._getAndParseFilterBatch(batch);
        const sbRefFilter = this._parseSubBatchFilterString(subBatchFilter) // format key/value/datatype[]
        if (!batchRefFilter.length || !sbRefFilter.length) {
            console.log('Error en los filtros batch y/o subBatch');
            console.log('Arguments', assessmentId, batchId, subBatchFilter);
            console.log('batchRefFilter', batchRefFilter);
            console.log('sbRefFilter', sbRefFilter);
            console.log('batchRefSchm', batchRefSchmId);
            console.log('batch', batch);

            return;
        }
        const restriction = this._getAndParseRestrictionAttr(assessSchm);
        console.log('restriction', restriction);

        const fullRefFilter = [...batchRefFilter, ...sbRefFilter];
        const searchQueryReferences = { schm: batchRefSchmId, filter: fullRefFilter }
        const aggregateQueryRecords = this._makeAggregateQueryRecordsObject(assessmentId, fullRefFilter);
        const aggregateQueryRestrictions = this._makeAggregateQueryRestrictionObject(restriction.schm, restriction.filter, fullRefFilter);

        console.log('fullRefFilter', fullRefFilter);
        console.log('searchQueryReferences', searchQueryReferences);
        console.log('aggregateQueryRecords', aggregateQueryRecords);
        console.log('aggregateQueryRestrictions', aggregateQueryRestrictions);

        const requests = [
            //descargando registros de referencia (plantas)
            this._bs.findRecords(searchQueryReferences),
            //descargando registros evaluados
            this._bs.findAggregateRecords(aggregateQueryRecords)
        ]
        if (restriction.isRestricted) {
            //descargando registro sin restricción
            requests.push(this._bs.findAggregateRecords(aggregateQueryRestrictions))
        }

        const res = await Promise.all(requests)
        console.log('RESPONSE', res);
        const c = res[0].map(x => {
            return {
                reference: x,
                record: find(res[1], { reference: x._id }),
                restricted: restriction.isRestricted && !find(res[2], { reference: x._id }) ? true : false
            }
        });
        console.log('ORDENADOA', c);

        return {
            batch,
            subBatchFilter: sbRefFilter,
            schema: assessSchm,
            schemaRef: batchRefSchm,
            data: c
        };
    }

    private _getAndParseFilterBatch(batch: IRecord): { key: string, value: any, datatype: string }[] {
        if (
            !find(batch.attributes, { id: '594079be9d4e5f0011f6df5b' }) ||
            !find(batch.attributes, { id: '594079be9d4e5f0011f6df5b' })['string']) { return []; }

        try {
            return JSON.parse(find(batch.attributes, { id: '594079be9d4e5f0011f6df5b' })['string']);
        } catch (e) {
            console.log('Error al parsear el filtro del batch');
            return [];
        }
    }
    private _parseSubBatchFilterString(sb: string): { key: string, value: any, datatype: string }[] {
        try {
            return JSON.parse(sb);
        } catch (error) {
            console.log('Error en el parseo del string subBatchFilter', error);
            return []
        }
    }
    private _getAndParseRestrictionAttr(assessSchm: ISchema): { isRestricted: boolean, schm: string, filter: { key: string, value: any, datatype: string }[] } {
        let isRestricted = true;
        if (
            !find(assessSchm.attributes, { id: 'restriction' }) ||
            !find(assessSchm.attributes, { id: 'restriction' })['listOfObj'] ||
            !find(assessSchm.attributes, { id: 'restriction' })['listOfObj'].length) {
            return { isRestricted: false, schm: undefined, filter: [] }
        }
        const restricConf = find(assessSchm.attributes, { id: 'restriction' })['listOfObj'];

        const schm = restricConf && find(restricConf, { id: 'schm' }) ? find(restricConf, { id: 'schm' })['string'] : undefined;

        const filter = restricConf && find(restricConf, { id: 'filter' }) ? restricConf.map(x => {
            let filter;
            if (x.id === 'filter' && x.string) {
                filter = x.string.split('|');

                if (/^\{.*\}$/.test(filter[1])) {
                    try { filter[1] = JSON.parse(filter[1]) }
                    catch (e) { console.log('Error en parseo de filter restriction ', e); }
                }
                return { key: filter[0], value: filter[1], datatype: filter[2] }
            }
        }).filter(x => x) : []; // format key/value/datatype[]

        return { isRestricted, schm, filter }
    }
    private _makeAggregateQueryRecordsObject(assessmentId: string, filter: { key: string, value: any, datatype: string }[]): any[] {
        return [
            { $match: { schm: { $oid: assessmentId } } },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1,
                    reference: {
                        $filter: {
                            input: '$attributes',
                            as: "attr",
                            cond: { $eq: ['$$attr.id', "57c42f77c8307cd5b82f4486"] } //reference attribute
                        }
                    }
                }
            },
            { $unwind: "$reference" },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: "$reference.reference"
                }
            },
            {
                $lookup: {
                    from: "records",
                    localField: "reference",
                    foreignField: "_id",
                    as: "plant"
                }
            },
            { $unwind: "$plant" },
            {
                $match: {
                    $and: filter.map(x => {
                        return { "plant.attributes": { $elemMatch: { id: x.key, [x.datatype]: x.value } } }
                    })
                }
            },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: 1
                }
            }

        ]
    }
    private _makeAggregateQueryRestrictionObject(schmId: string, filterRecord: { key: string, value: any, datatype: string }[], filterRefernece: { key: string, value: any, datatype: string }[]): any[] {
        const filterMatch = filterRecord.map(x => {
            return { $match: { "attributes": { $elemMatch: { id: x.key, [x.datatype]: x.value } } } }
        })
        return [
            { $match: { schm: { $oid: schmId } } },
            ...filterMatch,
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1,
                    reference: {
                        $filter: {
                            input: '$attributes',
                            as: "attr",
                            cond: { $eq: ['$$attr.id', "57c42f77c8307cd5b82f4486"] } //reference attribute
                        }
                    }
                }
            },
            { $unwind: "$reference" },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: "$reference.reference"
                }
            },
            {
                $lookup: {
                    from: "records",
                    localField: "reference",
                    foreignField: "_id",
                    as: "plant"
                }
            },
            { $unwind: "$plant" },
            {
                $match: {
                    $and: filterRefernece.map(x => {
                        return { "plant.attributes": { $elemMatch: { id: x.key, [x.datatype]: x.value } } }
                    })
                }
            },
            {
                $project: {
                    _id: 1, schm: 1, attributes: 1, updated: 1, created: 1, reference: 1
                }
            }
        ]
    }


}