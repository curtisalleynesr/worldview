import { requestAction } from '../core/actions';
import {
  REQUEST_PALETTE,
  SET_RANGE_AND_SQUASH,
  CLEAR_CUSTOM,
  SET_CUSTOM,
  LOADED_CUSTOM_PALETTES
} from './constants';
import {
  setRange as setRangeSelector,
  setCustom as setCustomSelector,
  clearCustom as clearCustomSelector
} from './selectors';
export function requestPalette(id) {
  return (dispatch, getState) => {
    const config = getState().config;
    var layer = config.layers[id];
    const location = 'config/palettes/' + layer.palette.id + '.json';
    return requestAction(
      dispatch,
      REQUEST_PALETTE,
      location,
      'application/json',
      id
    );
  };
}

export function setRange(layerId, min, max, squash, index, groupName) {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);
    const props = {
      min: min,
      max: max,
      squash: squash
    };
    const newActivePalettesObj = setRangeSelector(
      layerId,
      props,
      index,
      state.palettes[groupName],
      state
    );
    dispatch({
      type: SET_RANGE_AND_SQUASH,
      groupName: groupName,
      palettes: newActivePalettesObj
    });
  };
}
export function setCustom(layerId, paletteId, index, groupName) {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state.palettes.rendered);
    const newActivePalettesObj = setCustomSelector(
      layerId,
      paletteId,
      index,
      groupName,
      state
    );
    dispatch({
      type: SET_CUSTOM,
      layerId: layerId,
      paletteId: paletteId,
      groupName: groupName,
      palettes: newActivePalettesObj
    });
  };
}
export function clearCustom(layerId, index, groupName) {
  return (dispatch, getState) => {
    const { palettes } = getState();
    const newActivePalettesObj = clearCustomSelector(
      layerId,
      index,
      palettes[groupName]
    );

    dispatch({
      type: CLEAR_CUSTOM,
      groupName: groupName,
      palettes: newActivePalettesObj
    });
  };
}
export function loadedCustomPalettes(customs) {
  return {
    type: LOADED_CUSTOM_PALETTES,
    custom: customs
  };
}