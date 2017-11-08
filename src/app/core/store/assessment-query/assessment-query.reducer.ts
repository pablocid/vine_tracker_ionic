import * as assessmentQuery from './assessment-query.actions';
import { IRecord, ISchemaEmbedded } from '../../classes';

export interface AssessmentQueryState {
  loading: boolean;
  saving: boolean;
  saveStatus: boolean;
  saved: boolean;
  entities: { [id: string]: any };
  result: { record: IRecord, schema: ISchemaEmbedded, referenceId: string, allow: boolean };
}

export const initialState: AssessmentQueryState = {
  loading: false,
  saving: false,
  saveStatus: undefined,
  saved: false,
  entities: {},
  result: { record: undefined, schema: undefined, referenceId: undefined, allow: false }
}

export function AssessmentQueryReducer(state = initialState, action: assessmentQuery.Actions): AssessmentQueryState {
  switch (action.type) {
    case assessmentQuery.LOAD: {
      return {
        ...initialState,
        loading: true
      }
    }

    case assessmentQuery.LOAD_SUCCESS: {
      return {
        ...state,
        result: action.payload,
        loading: false,
      };
    }

    case assessmentQuery.LOAD_FAIL: {
      return {
        ...initialState,
        loading: false,
        entities: { error: true, message: action.payload }
      };
    }

    case assessmentQuery.SAVE: {
      return {
        ...state,
        saving: true
      }
    }
     

    case assessmentQuery.SAVE_SUCCESS: {
      return {
        ...state,
        saveStatus: true,
        saving: false,
        saved: true
      };
    }

    case assessmentQuery.SAVE_FAIL: {
      return {
        ...initialState,
        saveStatus: false,
        saving: false,
        entities: { error: true, message: action.payload },
      };
    }

    default: {
      return state;
    }
  }
}