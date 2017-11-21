import * as assessment from './assessment.actions';
import { clone, find, cloneDeep } from 'lodash';
import { IAttribute, ISchemaEmbedded, IRecord } from '../../classes';
import bson from 'bson';

export interface AssessmentState {
  loading: boolean;
  entities: {
    record: IRecord,
    schema: ISchemaEmbedded,
    editable: boolean,
    isNew: boolean
  };
  selectedIndex: number;
  editing: IAttribute;
  uploading: boolean;
  uploadStatus: boolean;
  img: {
    path?: any,
    name: string,
    index: number;
    formData?: FormData
  }
  //result: string[];
}

export const initialState: AssessmentState = {
  loading: false,
  entities: {
    record: null,
    schema: null,
    editable: false,
    isNew: false
  },
  selectedIndex: 0,
  editing: undefined,
  uploading: false,
  uploadStatus: undefined,
  img: {
    path: undefined,
    name: undefined,
    index: undefined
  }
  //result: []
}

export function AssessmentReducer(state = initialState, action: assessment.Actions): AssessmentState {
  switch (action.type) {
    case assessment.LOAD: {
      return {
        ...initialState,
        entities: setRecordAndSchema(action.payload.record, action.payload.schema, action.payload.editable, action.payload.referenceId),
        loading: true
      }
    }

    case assessment.LOAD_SUCCESS: {

      return {
        ...state,
        loading: false,
      };
    }

    case assessment.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
      };
    }

    case assessment.UPDATE_VALUE: {
      state.entities = {
        ...state.entities,
        record: updateAttrValue(state.entities.record, action.payload)
      }
      return {
        ...state,
      };
    }

    case assessment.SAVE_VALUE: {
      state.selectedIndex = 0;
      state.editing = undefined;
      return {
        ...state,
      };
    }

    case assessment.EVALUATE: {
      setIfAttrNotExist(state.entities.record, action.payload);
      state.editing = currentEvaluation(state.entities.record, action.payload);
      // console.log('state.editing = currentEvaluation(state.entities.record, action.payload);', state.editing);

      //console.log('case assessment.EVALUATE:', state);

      return {
        ...state,
        selectedIndex: 1
      };
    }

    case assessment.CANCEL_EVALUATION: {
      state.entities.record = restoreValue(state);
      state.editing = undefined;
      state.selectedIndex = 0;
      //console.log('cancel state', state);

      return {
        ...state,
      };
    }

    case assessment.TAKE_PIC: {
      return {
        ...state,
        img: action.payload,
        uploadStatus: false
      }
    }

    case assessment.UPLOAD_IMG: {
      return {
        ...state,
        img: action.payload,
        uploading: true,
        uploadStatus: false
      }
    }

    case assessment.UPLOAD_IMG_SUCCESS: {
      console.log('upload success');
      state.entities.record = updateImageListAfterUploadedImg(state);

      return {
        ...state,
        uploading: false,
        uploadStatus: true,
        img: initialState.img
      };
    }

    case assessment.UPLOAD_IMG_FAIL: {
      console.log('upload fail');

      return {
        ...state,
        uploading: false,
        uploadStatus: false,
        img: initialState.img
      };
    }

    default: {
      return state;
    }
  }
}

function updateImageListAfterUploadedImg(state: AssessmentState): IRecord {
  console.log('stae in update image list after upladed img', state);

  const attrId = state.editing.id;
  const index = state.entities.record.attributes.map(x => x.id).indexOf(attrId);
  if (index === -1) {
    console.log('Attributo de imagenes no existe, creando ...');
    const list = [];
    list[state.img.index] = state.img.name;
    state.entities.record.attributes.push({ id: attrId, list })
    return cloneDeep(state.entities.record);
  }
  if (!Array.isArray(state.entities.record.attributes[index].list)) {
    state.entities.record.attributes[index].list = [];
  }
  state.entities.record.attributes[index].list[state.img.index] = state.img.name;
  console.log('state.entities.record.attributes[index]', state.entities.record.attributes[index]);

  return cloneDeep(state.entities.record);
}

function currentEvaluation(record: IRecord, id: string): IAttribute {
  let a = find(record.attributes, { id });
  return cloneDeep(a);
}

function setIfAttrNotExist(record: IRecord, id: string) {
  if (!find(record.attributes, { id })) {
    console.log('Attr no existe');
    
    record.attributes.push({ id });
  }
}

function updateAttrValue(record: IRecord, value: IAttribute): IRecord {
  let attrs = record.attributes;

  if (value === undefined || value === null || value.id === undefined) { return record; }
  if (!attrs || !Array.isArray(attrs)) { attrs = []; }
  const index = attrs.map(x => x.id).indexOf(value.id);
  if (index === -1) { attrs.push(value) }
  else { attrs[index] = value }
  record.attributes = attrs;
  return cloneDeep(record);
}

function restoreValue(state: AssessmentState): IRecord {
  //console.log('Restoring attribute data ');
  if (state.editing === undefined) { return cloneDeep(state.entities.record); }
  const id = state.editing.id;
  const index = state.entities.record.attributes ? state.entities.record.attributes.map(x => x.id).indexOf(id) : -1;
  if (index !== -1) { state.entities.record.attributes[index] = state.editing; }
  return cloneDeep(state.entities.record);
}

function setRecordAndSchema(record: IRecord, schema: ISchemaEmbedded, editable: boolean, referenceId: string) {
  let isNew;
  if (!record) { record = { _id: undefined, schm: undefined, created: undefined, updated: undefined, attributes: [] }; }
  if (!record._id) {
    isNew = true;
    record._id = new bson.ObjectID().toString();
  } else { isNew = false; }
  if (!record.created) { record.created = (new Date()).toISOString(); }
  if (!record.schm) { record.schm = schema._id; }
  if (!record.updated) { record.updated = []; }

  if (!record.attributes || !Array.isArray(record.attributes) || !record.attributes.length) {
    record.attributes = cloneDeep(find(schema.attributes, { id: 'attributes' })['list']).map(x => ({ id: x }));
  }

  if (referenceId && record.attributes) {
    if (find(record.attributes, { id: "57c42f77c8307cd5b82f4486" })) {
      find(record.attributes, { id: "57c42f77c8307cd5b82f4486" })['reference'] = referenceId;
    } else {
      record.attributes.push({ id: "57c42f77c8307cd5b82f4486", reference: referenceId })
    }
  }
  console.log('setting record', record);
  
  // if (!record.attributes) { record.attributes = [] }
  // if (referenceId && !find(record.attributes, { id: '57c42f77c8307cd5b82f4486' })) {
  //   record.attributes.push({ id: "57c42f77c8307cd5b82f4486", reference: referenceId });
  // }

  return { record, schema, editable, isNew };
}