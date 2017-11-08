import { Base } from './base';
import { IAttributeSchema } from './interfaces'
import { find } from 'lodash';

export class Schema extends Base {
    protected _type: string;
    protected _name: string;
    private _Attributes: IAttributeSchema[];

    constructor() {
        super();
    }

    public getRef() {
        return this;
    }

    public get name(): string {
        return this.getAttr('name', 'string');
    }

    public get description(): string {
        return this.getAttr('description', 'string');
    }

    public get type(): string {
        return this._type;
    }

    public setEmbebedData(raw: any) {
        if (raw) {
            this._setBaseData(raw);
            this._Attributes = raw.Attributes;
        }
    }

    private _getDatatype(_id: string) {
        return (<any>find((<IAttributeSchema>find(this._Attributes, { _id })).Input.attributes, { id: 'dataType' })).string;
    }

    public getDataTypeById(_id: string) {
        return this._getDatatype(_id);
    }

    public getAttrIdByName(name: string) {
        return this._Attributes.filter(x => x.attributes.some(x => x.id === 'name' && x.string === name))[0]._id;
    }

    public getDataTypeByName(name: string) {
        return this._getDatatype(this.getAttrIdByName(name));
    }

    private _setBaseData(raw: any) {
        this._id = raw._id;
        this._type = raw.type;
        this._name = raw.name;
        this._created = raw.created;
        this._updated = raw.updated;
        this._attributes = raw.attributes;
    }

    public setArrayData(_id: string, schemas: any[]) {

        if (!_id || !schemas || !Array.isArray(schemas) || !schemas.length) {
            throw new Error('Error en setup de schema')
        }

        let schema;

        try {
            schema = <any>find(schemas, { _id });
            const idAttr = (<any>find(schema.attributes, { id: 'attributes' })).list;
            const Attr = [];
            for (let i = 0; i < idAttr.length; i++) {
                Attr.push(find(schemas, { _id: idAttr[i] }))
            }

            schema.Attributes = Attr.map(x => {
                const iid = (<any>find(x.attributes, { id: 'input' })).reference;
                x.Input = find(schemas, { _id: iid });
                return x;
            })

        } catch (e) {
            console.log('Error en el parseo del schema: setArrayData method: ', e);
        }

        if (schema) {
            this.setEmbebedData(schema);
        }
    }

    public getAttr(attrId: string, target?: string, key?: string) {
        if (!key) { key = 'id' };
        if (key === undefined && attrId === undefined) { return null; }

        var index = this._attributes.map(x => x[key]).indexOf(attrId);
        if (index === -1) { return null }

        if (target === undefined) { return this._attributes[index]; }

        return this._attributes[index][target];
    }

    public get properties(): any {

        var keyObj = this.getAttr('keys', 'listOfObj');

        if (!keyObj || keyObj.legth === 0) { return {}; }

        var data = {};
        for (var index = 0; index < keyObj.length; index++) {
            let id = keyObj[index]['id'];
            let value = keyObj[index]['string'];

            data[id] = this.getAttr(id, value);
        }

        return data;
    }
    public get listAttrIds(): string[] {
        return this.getAttr('attributes', 'list');
    }

    public get Attributes(): IAttributeSchema[] {
        return this._Attributes;
    }

    public getAttrSchmById(_id: string): IAttributeSchema {
        return find(this.Attributes, { _id });
    }
}
