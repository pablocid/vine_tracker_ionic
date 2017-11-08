import { IAttribute, IUpdated } from './interfaces'

export class Base {
    protected _id: string;
    protected _created: string;
    protected _updated: IUpdated[] = [];
    protected _attributes: IAttribute[] = [];

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get created(): string {
        return this._created;
    }
    public set created(value: string) {
        this._created = value;
    }

    public get updated(): IUpdated[] {
        return this._updated;
    }
    public set updated(value: IUpdated[]) {
        this._updated = value;
    }

    public pushUpdate(value: IUpdated) {
        this._updated.push(value);
    }

    public get attributes(): IAttribute[] {
        return this._attributes;
    }
    public set attributes(value: IAttribute[]) {
        this._attributes = value;
    }
    public pushAttribute(value: IAttribute) {
        this._attributes.push(value);
    }
}

