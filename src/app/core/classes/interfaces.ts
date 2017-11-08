export interface IAttributeSchema extends IBase {
    type: string;
    Input: IInputSchema;
}

export interface IInputSchema extends IBase {
    type: string;
}

export interface IUpdated {
    user?: string;
    date: string
}

export interface IAttribute {
    id: string;
    string?: string;
    boolean?: boolean;
    date?: string;
    number?: number;
    reference?: string;
    listOfObj?: any[];
    list?: string[];
}

export interface IBase {
    _id: string;
    created: string;
    updated: IUpdated[];
    attributes: IAttribute[];
}

export interface IRecord extends IBase {
    schm: string
}

export interface ISchema extends IBase {
    type: string;
    name: string;
}

export interface ISchemaEmbedded extends IBase {
    type: string;
    name: string;
    Attributes: IAttributeSchema[];
}

export interface IRecordInfo {
    record: IRecord;
    schema: ISchemaEmbedded
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}