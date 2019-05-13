import {
  RESET_LAYERS,
  ADD_LAYER,
  INIT_SECOND_LAYER_GROUP,
  REORDER_LAYER_GROUP,
  ON_LAYER_HOVER,
  TOGGLE_LAYER_VISIBILITY,
  REMOVE_LAYER,
  UPDATE_OPACITY
} from './constants';
import {
  SET_CUSTOM as SET_CUSTOM_PALETTE,
  SET_RANGE_AND_SQUASH
} from '../palettes/constants';
import { resetLayers } from './selectors';
import {
  cloneDeep as lodashCloneDeep,
  assign as lodashAssign,
  findIndex as lodashFindIndex
} from 'lodash';
import update from 'immutability-helper';

export const initialState = {
  active: [],
  activeB: [],
  layersConfig: {},
  hoveredLayer: '',
  layerConfig: {},
  startingLayers: [],
  hasSecondLayerGroup: false
};
export function getInitialState(config) {
  return lodashAssign({}, initialState, {
    active: resetLayers(config.defaults.startingLayers, config.layers),
    layerConfig: config.layers,
    startingLayers: config.defaults.startingLayers
  });
}

export function layerReducer(state = initialState, action) {
  const layerGroupStr = action.activeString;
  switch (action.type) {
    case RESET_LAYERS || ADD_LAYER:
      return lodashAssign({}, state, {
        [layerGroupStr]: action.layers
      });
    case INIT_SECOND_LAYER_GROUP:
      if (state.hasSecondLayerGroup) return state;
      return lodashAssign({}, state, {
        activeB: lodashCloneDeep(state.active)
      });
    case REORDER_LAYER_GROUP:
      return lodashAssign({}, state, {
        [layerGroupStr]: action.layerArray
      });
    case ON_LAYER_HOVER:
      return lodashAssign({}, state, {
        hoveredLayer: action.active ? action.id : ''
      });
    case TOGGLE_LAYER_VISIBILITY:
      return update(state, {
        [layerGroupStr]: {
          [action.index]: { visible: { $set: action.visible } }
        }
      });
    case SET_RANGE_AND_SQUASH:
      let layerIndex = lodashFindIndex(state[layerGroupStr], {
        id: action.layerId
      });
      return update(state, {
        [layerGroupStr]: {
          [layerIndex]: {
            $merge: action.props
          }
        }
      });
    case SET_CUSTOM_PALETTE:
      layerIndex = lodashFindIndex(state[layerGroupStr], {
        id: action.layerId
      });
      return update(state, {
        [layerGroupStr]: {
          [layerIndex]: {
            palette: {
              $set: action.paletteId
            }
          }
        }
      });
    case REMOVE_LAYER:
      return update(state, {
        [layerGroupStr]: { $splice: [[action.index, 1]] }
      });
    case UPDATE_OPACITY:
      return update(state, {
        [layerGroupStr]: {
          [action.index]: { opacity: { $set: action.opacity } }
        }
      });
    default:
      return state;
  }
}
