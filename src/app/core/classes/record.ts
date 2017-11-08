import { Schema } from './schema';
import { Base } from './base';
import { find } from 'lodash';

export class Record extends Base {
    private _schema: Schema;
    private _schm: string;

    constructor(raw?: any, schema?:Schema) {
        super();
        if (raw) {
            this.setData(raw);
        }
        if(schema){
            this._schema = schema
        }
    }

    public get schm(): string {
        return this._schm;
    }
    public set schm(value: string) {
        this._schm = value;
    }

    public set Schema(value: Schema) {
        this._schema = value;
    }

    public get Schema(): Schema {
        return this._schema;
    }

    public get(value: string) {
        try {
            return this._getAttributeById(this.Schema.getAttrIdByName(value))[this.Schema.getDataTypeByName(value)];
        } catch (e) { 
            console.log('catching in Record Class get: ',e); 
        }

        return null;
    }

    public getById(_id: string) {
        try {
            return this._getAttributeById(_id)[this.Schema.getDataTypeById(_id)];
        } catch (e) { 
            console.log('catching in Record Class getById: ',e); 
        }

        return null;
    }

    private _getAttributeById(id: string) {
        return find(this._attributes, { id })
    }

    public getAttr(key, dd){
        return find(this._attributes, {id:key})[dd];
    }

    public setData(raw: any) {
        if (raw._id) { this._id = raw._id; }
        if (raw.created) { this._created = raw.created; }
        if (raw.updated) { this._updated = raw.updated; }
        if (raw.attributes) { this._attributes = raw.attributes; }
    }

    public getData(userSign?: string): any {
        const data = {};
        if (this._id) data['_id'] = this._id;
        if (!this.created) this.created = new Date().toISOString();
        if (userSign !== 'noSign') {
            this.pushUpdate({ user: userSign, date: new Date().toISOString() });
        } else {
            this.pushUpdate({ date: new Date().toISOString() })
        }

        data['schm'] = this.schm;
        data['created'] = this._created;
        data['updated'] = this._updated;
        data['attributes'] = this._attributes;

        return data;
    }


}
