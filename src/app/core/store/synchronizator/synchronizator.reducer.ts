import * as synchronizator from './synchronizator.actions';

export interface SyncState {
  loading: boolean;
  entities: { [id: string]: any };
  result: string[];
  schema: {
    checking: boolean;
    isUpdated: boolean;
    synchronizing: boolean;
    syncStatus: boolean;
  };
  batch: {
    checking: boolean;
    isUpdated: boolean;
    synchronizing: boolean;
    syncStatus: boolean;
  };
  checkSchmBatch: boolean;
}

export const initialState: SyncState = {
  loading: false,
  entities: {},
  result: [],
  schema: {
    checking: false,
    isUpdated: true,
    synchronizing: false,
    syncStatus: true
  },
  batch: {
    checking: false,
    isUpdated: true,
    synchronizing: false,
    syncStatus: true
  },
  checkSchmBatch: false,
}

export function SyncReducer(state = initialState, action: synchronizator.Actions): SyncState {
  switch (action.type) {
    case synchronizator.LOAD: {
      return {
        ...state,
        loading: true
      }
    }

    case synchronizator.LOAD_SUCCESS: {

      return {
        ...state,
        loading: false
      };
    }

    case synchronizator.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
      };
    }

    case synchronizator.CHECK_SCHM: {
      return {
        ...state,
        schema: {
          ...state.schema,
          checking: true
        }
      }
    }

    case synchronizator.CHECK_SCHM_SUCCESS: {

      return {
        ...state,
        schema: {
          ...state.schema,
          checking: false,
          isUpdated: action.payload
        }
      };
    }

    case synchronizator.CHECK_SCHM_FAIL: {

      return {
        ...state,
        schema: {
          ...state.schema,
          checking: false
        }
      };
    }

    case synchronizator.SYNC_SCHM: {
      return {
        ...state,
        schema: {
          ...state.schema,
          synchronizing: true
        }
      }
    }

    case synchronizator.SYNC_SCHM_SUCCESS: {

      return {
        ...state,
        schema: {
          ...state.schema,
          synchronizing: false,
          isUpdated: action.payload,
          syncStatus: action.payload
        }
      };
    }

    case synchronizator.SYNC_SCHM_FAIL: {

      return {
        ...state,
        schema: {
          ...state.schema,
          synchronizing: false,
          syncStatus: false
        }
      };
    }

    case synchronizator.CHECK_BATCH: {
      return {
        ...state,
        batch: {
          ...state.schema,
          checking: true,
        }
      }
    }

    case synchronizator.CHECK_BATCH_SUCCESS: {
      return {
        ...state,
        batch: {
          ...state.schema,
          checking: false,
          isUpdated: action.payload,
        }
      };
    }

    case synchronizator.CHECK_BATCH_FAIL: {

      return {
        ...state,
        batch: {
          ...state.schema,
          checking: false,
          isUpdated: false,
        }
      };
    }

    case synchronizator.SYNC_BATCH: {
      return {
        ...state,
        batch: {
          ...state.schema,
          synchronizing: true
        }
      }
    }

    case synchronizator.SYNC_BATCH_SUCCESS: {

      return {
        ...state,
        batch: {
          ...state.schema,
          synchronizing: false,
          isUpdated: action.payload,
          syncStatus: action.payload
        }
      };
    }

    case synchronizator.SYNC_BATCH_FAIL: {

      return {
        ...state,
        batch: {
          ...state.schema,
          synchronizing: false,
          syncStatus: false
        }
      };
    }

    case synchronizator.CHECK_SCHM_AND_BATCH: {
      return {
        ...state,
        checkSchmBatch: true
      }
    }

    case synchronizator.CHECK_SCHM_AND_BATCH_SUCCESS: {
      return {
        ...state,
        checkSchmBatch: false,
        batch: {
          ...state.batch,
          isUpdated: action.payload.batch
        },
        schema: {
          ...state.schema,
          isUpdated: action.payload.schm
        }
      }
    }

    case synchronizator.CHECK_SCHM_AND_BATCH_FAIL: {
      return {
        ...state,
        checkSchmBatch: false
      }
    }

    default: {
      return state;
    }
  }
}