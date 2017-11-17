import * as quickStart from './quick-start.actions';
import { IRecordInfo, ISchemaEmbedded, IRecord } from '../../classes';
import { AppStates } from '../store.module';
import { find } from 'lodash';

export interface QuickStartState {
  loading: boolean;
  status: boolean;
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
  status: true,
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
        status: true
      };
    }

    case quickStart.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
        status: false
      };
    }

    case quickStart.LOAD_MANUAL: {
      return {
        ...state,
        loading: true,
        status: true,
        entities: {
          ...state.entities,
          refInfo: initialState.entities.refInfo,
          batch: initialState.entities.batch,
          assessments: initialState.entities.assessments
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
        status: true
      }
    }

    case quickStart.LOAD_MANUAL_FAIL: {
      console.log('LOAD_MANUAL_FAIL');
      return {
        ...state,
        loading: false,
        status: false
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

    case quickStart.LOAD_SCANNER: {
      return {
        ...state,
        loading: true,
        status: true,
        entities: {
          ...state.entities,
          refInfo: initialState.entities.refInfo,
          batch: initialState.entities.batch,
          assessments: initialState.entities.assessments
        }

      }
    }

    case quickStart.LOAD_SCANNER_SUCCESS: {
      console.log('LOAD_SCANNER_SUCCESS action.payload', action.payload);

      const entities = {
        ...state.entities,
        refInfo: action.payload,
        manualSearch: updateManualSearchAfterScannerSuccess(action.payload)
      }

      return {
        ...state,
        loading: false,
        status: true,
        entities
      }
    }

    case quickStart.LOAD_SCANNER_FAIL: {
      console.log('LOAD_SCANNER_FAIL');

      return {
        ...state,
        loading: false,
        status: false
      }
    }

    default: {
      return state;
    }
  }
}

function updateManualSearchAfterScannerSuccess(recordInfo: IRecordInfo): { espaldera: number, hilera: number, posicion: number } {
  try {
    const espaldera = find(recordInfo.record.attributes, { id: "5807af5f31f55d0010aaffe4" })['number'];
    const hilera = find(recordInfo.record.attributes, { id: "5807af9231f55d0010aaffe5" })['number'];
    const posicion = find(recordInfo.record.attributes, { id: "5807afe331f55d0010aaffe6" })['number'];
    return { espaldera, hilera, posicion };
  } catch (e) {
    return { espaldera: 0, hilera: 0, posicion: 0 }
  }
}