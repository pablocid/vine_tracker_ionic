import * as quickStart from './quick-start.actions';
import { IRecordInfo, ISchemaEmbedded, IRecord } from '../../classes';
export interface QuickStartState {
  loading: boolean;
  entities: {
    manualSearch: {
      espaldera: number,
      hilera: number,
      posicion: number
    },
    refInfo: IRecordInfo,
    batch: IRecord,
    assessments: ISchemaEmbedded[]
  };
  result: string[];
  loadingReference: boolean;

}

export const initialState: QuickStartState = {
  loading: false,
  loadingReference: false,
  entities: {
    manualSearch: {
      espaldera: 5,
      hilera: 2,
      posicion: 2
    },
    refInfo: undefined,//{ record: undefined, schema: undefined },
    batch: null,
    assessments: []
  },
  result: []
}

export function QuickStartReducer(state = initialState, action: quickStart.Actions): QuickStartState {
  switch (action.type) {
    case quickStart.LOAD: {
      console.log('case quickStart.LOAD: {')
      return {
        ...state,
        loading: true
      }
    }

    case quickStart.LOAD_SUCCESS: {
      state.entities = {
        ...state.entities,
        batch: action.payload.batch,
        assessments: action.payload.assessments
      }
      return {
        ...state,
        loading: false,
      };
    }

    case quickStart.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
      };
    }

    case quickStart.LOAD_MANUAL: {
      return {
        ...state,
        loading:true,
        entities:{
          ...state.entities,
          refInfo:initialState.entities.refInfo,
          batch:initialState.entities.batch,
          assessments:initialState.entities.assessments
        }

      }
    }

    case quickStart.LOAD_MANUAL_SUCCESS: {
      state.entities = {
        ...state.entities,
        refInfo: action.payload
      }

      return {
        ...state,
      }
    }

    case quickStart.LOAD_MANUAL_FAIL: {
      return {
        ...state,
        loading: false
      }
    }

    case quickStart.UPDATE_MANUAL_POSITION: {
      state.entities = {
        ...state.entities,
        manualSearch: {
          espaldera: action.payload.espaldera,
          hilera: action.payload.hilera,
          posicion: action.payload.posicion
        }
      }
      return state
    }

    default: {
      return state;
    }
  }
}