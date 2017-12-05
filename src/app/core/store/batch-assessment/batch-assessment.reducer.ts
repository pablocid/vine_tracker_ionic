import * as batchAssessment from './batch-assessment.actions';
import { IRecordInfo, ISchemaEmbedded, IRecord } from '../../classes';
import { find } from 'lodash';

export interface BatchAssessmentState {
  loading: boolean;
  loadingAssessment: boolean;
  updatingSelected: boolean;
  entities: { assessmentId: string, batchId: string, subBatchFilter: string };
  assessment: { record: IRecord, reference: IRecord, restricted: boolean };
  selected: { record: IRecord, reference: IRecord, restricted: boolean };
  result: {
    schema: ISchemaEmbedded,
    schemaRef: ISchemaEmbedded,
    batch: IRecord,
    subBatchFilter: any,
    data: { record: IRecord, reference: IRecord, restricted: boolean, isWarn: boolean }[]
  };
}

export const initialState: BatchAssessmentState = {
  loading: false,
  loadingAssessment: false,
  updatingSelected: false,
  entities: { assessmentId: undefined, batchId: undefined, subBatchFilter: undefined },
  selected: { record: undefined, reference: undefined, restricted: false },
  result: {
    schema: undefined,
    schemaRef: undefined,
    batch: undefined,
    subBatchFilter: {},
    data: []
  },
  assessment: { record: undefined, reference: undefined, restricted: true }
}

export function BatchAssessmentReducer(state = initialState, action: batchAssessment.Actions): BatchAssessmentState {
  switch (action.type) {
    case batchAssessment.LOAD: {
      return {
        ...initialState,
        loading: true,
        entities: action.payload
      }
    }

    case batchAssessment.UPDATE: {
      return {
        ...state,
        loading: true,
      }
    }

    case batchAssessment.LOAD_SUCCESS: {

      return {
        ...state,
        loading: false,
        result: action.payload
      };
    }

    case batchAssessment.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
      };
    }

    case batchAssessment.SELECT_ASSESS: {
      return {
        ...state,
        selected: getSelectedAssess(state, action.payload)
      }
    }

    case batchAssessment.UPDATE_ASSESS: {
      console.log('Uploading assess list');
      
      return {
        ...state,
        updatingSelected: true
      }
    }

    case batchAssessment.UPDATE_ASSESS_SUCCESS: {
      console.log('UPDATE_ASSESS_SUCCESS');
      state.result = {
        ...state.result,
        data: action.payload
      }
      return {
        ...state,
        updatingSelected: false,
      }
    }

    case batchAssessment.UPDATE_ASSESS_FAIL: {
      console.log('case batchAssessment.UPDATE_ASSESS_FAIL');

      return {
        ...state,
        updatingSelected: false
      }
    }

    default: {
      return state;
    }
  }
}

function getSelectedAssess(state: BatchAssessmentState, id): { record: IRecord, reference: IRecord, restricted: boolean } {
  try {
    const index = state.result.data.map(x => x.reference._id).indexOf(id);
    if (index !== -1) {
      return state.result.data[index];
    }
    return initialState.selected;
  } catch (e) {
    console.log('Error selecionando la evaluación/planta', e);

    return initialState.selected;
  }

}

function updateSelectedRecord(data: { record: IRecord, reference: IRecord, restricted: boolean }[], record: IRecord, assessmentId: string) {
  console.log('Updated Record is: ', record)
  try {
    const idRef = find(record.attributes, { id: '57c42f77c8307cd5b82f4486' })['reference'];
    const index = data.map(x => x.reference._id).indexOf(idRef);
    if (index !== -1) {
      let p = data[index];
      if (record.schm !== assessmentId) {
        return data;
      }
      p.record = record;
      data.splice(index, 1);
      data.push(p);

      return [...data];
    } else {
      return data;
    }
  } catch (e) {
    console.log('Error in finding update selected record');
    return data;

  }
}