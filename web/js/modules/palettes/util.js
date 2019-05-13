import {
  each as lodashEach,
  find as lodashFind,
  assign as lodashAssign
} from 'lodash';
import {
  setCustom as setCustomSelector,
  getCount,
  setRange as setRangeSelector,
  findIndex as findPaletteExtremeIndex
} from './selectors';

import update from 'immutability-helper';
import util from '../../util/util';
export function getCheckerboard() {
  var size = 2;
  var canvas = document.createElement('canvas');

  canvas.width = size * 2;
  canvas.height = size * 2;

  var g = canvas.getContext('2d');

  // g.fillStyle = "rgb(102, 102, 102)";
  g.fillStyle = 'rgb(200, 200, 200)';
  g.fillRect(0, 0, size, size);
  g.fillRect(size, size, size, size);

  // g.fillStyle = "rgb(153, 153, 153)";
  g.fillStyle = 'rgb(240, 240, 240)';
  g.fillRect(0, size, size, size);
  g.fillRect(size, 0, size, size);

  return g.createPattern(canvas, 'repeat');
}
export function palettesTranslate(source, target) {
  var translation = [];
  lodashEach(source, function(color, index) {
    var sourcePercent = index / source.length;
    var targetIndex = Math.floor(sourcePercent * target.length);
    translation.push(target[targetIndex]);
  });
  return translation;
}
/**
 * Redraw canvas with selected colormap
 * @param {String} ctxStr | String of wanted cavnas
 * @param {Object} checkerBoardPattern | Background for canvas threshold
 * @param {Array} colors | array of color values
 */
export function drawPaletteOnCanvas(
  ctx,
  checkerBoardPattern,
  colors,
  width,
  height
) {
  ctx.fillStyle = checkerBoardPattern;
  ctx.fillRect(0, 0, width, height);

  if (colors) {
    var bins = colors.length;
    var binWidth = width / bins;
    var drawWidth = Math.ceil(binWidth);
    colors.forEach((color, i) => {
      ctx.fillStyle = util.hexToRGBA(color);
      ctx.fillRect(Math.floor(binWidth * i), 0, drawWidth, height);
    });
  }
}
export function lookup(sourcePalette, targetPalette) {
  var lookup = {};
  lodashEach(sourcePalette.colors, function(sourceColor, index) {
    var source =
      parseInt(sourceColor.substring(0, 2), 16) +
      ',' +
      parseInt(sourceColor.substring(2, 4), 16) +
      ',' +
      parseInt(sourceColor.substring(4, 6), 16) +
      ',' +
      '255';
    var targetColor = targetPalette.colors[index];
    var target = {
      r: parseInt(targetColor.substring(0, 2), 16),
      g: parseInt(targetColor.substring(2, 4), 16),
      b: parseInt(targetColor.substring(4, 6), 16),
      a: 255
    };
    lookup[source] = target;
  });
  return lookup;
}
export function loadRenderedPalette(config, layerId) {
  var layer = config.layers[layerId];
  return util.load.config(
    config.palettes.rendered,
    layer.palette.id,
    'config/palettes/' + layer.palette.id + '.json'
  );
}
export function loadCustom(config) {
  return util.load.config(
    config.palettes,
    'custom',
    'config/palettes-custom.json'
  );
}
export function getMinValue(v) {
  return v.length ? v[0] : v;
}

export function getMaxValue(v) {
  return v.length ? v[v.length - 1] : v;
}
export function parsePalettes(state, errors, config) {
  if (state.palettes) {
    var parts = state.palettes.split('~');
    lodashEach(parts, function(part) {
      var items = part.split(',');
      var layerId = items[0];
      var paletteId = items[1];
      if (!config.layers[layerId]) {
        errors.push({
          message: 'Invalid layer for palette ' + paletteId + ': ' + layerId
        });
      } else if (!config.layers[layerId].palette) {
        errors.push({
          message: 'Layer ' + layerId + ' does not ' + 'support palettes'
        });
      } else {
        var layer = lodashFind(state.l, {
          id: layerId
        });
        if (layer) {
          layer.attributes.push({
            id: 'palette',
            value: paletteId
          });
        } else {
          errors.push({
            message: 'Layer ' + layerId + ' is not ' + 'active'
          });
        }
      }
    });
    delete state.paletes;
  }
}
export function isSupported() {
  var browser = util.browser;
  return !(browser.ie || !browser.webWorkers || !browser.cors);
}
export function getPaletteAttributeArray(layerId, palettes, state) {
  const count = getCount(layerId, state);
  const DEFAULT_ATTR_OBJ = { array: [], isActive: false, value: undefined };
  let palettesObj = lodashAssign({}, DEFAULT_ATTR_OBJ, { key: 'palette' });
  let minObj = lodashAssign({}, DEFAULT_ATTR_OBJ, { key: 'min' });
  let maxObj = lodashAssign({}, DEFAULT_ATTR_OBJ, { key: 'max' });
  let squashObj = lodashAssign({}, DEFAULT_ATTR_OBJ, { key: 'squash' });
  let attrArray = [];
  for (let i = 0; i < count; i++) {
    let paletteDef = palettes[layerId].maps[i];

    palettesObj = createPaletteAttributeObject(
      paletteDef,
      paletteDef.palette,
      palettesObj,
      count
    );
    minObj = createPaletteAttributeObject(
      paletteDef,
      paletteDef.entries.values[paletteDef.min],
      minObj,
      count
    );
    maxObj = createPaletteAttributeObject(
      paletteDef,
      paletteDef.entries.values[paletteDef.max || 0],
      maxObj,
      count
    );
    squashObj = createPaletteAttributeObject(
      paletteDef,
      true,
      squashObj,
      count
    );
  }
  [palettesObj, minObj, maxObj, squashObj].forEach(obj => {
    if (obj.isActive) attrArray.push(obj.value);
  });
  return attrArray;
}
const createPaletteAttributeObject = function(def, value, attrObj, count) {
  const key = attrObj.key;
  let attrArray = attrObj.array;
  let hasAtLeastOnePair = attrObj.isActive;
  if (def[key] && value) {
    attrArray.push(value);
    hasAtLeastOnePair = true;
  } else if (count > 1) {
    attrArray.push('');
  }
  return {
    array: attrArray,
    isActive: hasAtLeastOnePair,
    value: attrArray.join(';')
  };
};
export function loadPalettes(permlinkState, state) {
  var stateArray = [{ stateStr: 'l', groupStr: 'active' }];
  if (!isSupported()) {
    return self;
  }
  if (permlinkState.l1) {
    stateArray = [
      { stateStr: 'l', groupStr: 'active' },
      { stateStr: 'l1', groupStr: 'activeB' }
    ];
  }
  lodashEach(stateArray, stateObj => {
    lodashEach(state.layers[stateObj.groupStr], function(layerDef) {
      var layerId = layerDef.id;
      var min = [];
      var max = [];
      var squash = [];
      var count = 0;
      if (layerDef.custom) {
        lodashEach(layerDef.custom, function(value, index) {
          try {
            let newPalettes = setCustomSelector(
              layerId,
              value,
              index,
              stateObj.groupStr,
              state
            );
            state = update(state, {
              palettes: { [stateObj.groupStr]: { $set: newPalettes } }
            });
          } catch (error) {
            console.warn(' Invalid palette: ' + value);
          }
        });
      }
      if (layerDef.min) {
        console.log('min');
        lodashEach(layerDef.min, function(value, index) {
          try {
            min.push(
              findPaletteExtremeIndex(
                layerId,
                'min',
                value,
                index,
                stateObj.groupStr,
                state
              )
            );
          } catch (error) {
            console.warn('Unable to set min: ' + value);
          }
        });
      }
      if (layerDef.max) {
        lodashEach(layerDef.max, function(value, index) {
          try {
            max.push(
              findPaletteExtremeIndex(
                layerId,
                'max',
                value,
                index,
                stateObj.groupStr,
                state
              )
            );
          } catch (error) {
            console.warn('Unable to set max index: ' + value);
          }
        });
      }
      if (layerDef.squash) {
        squash = layerDef.squash;
      }

      if (min.length > 0 || max.length > 0) {
        count = getCount(layerId, state);
        for (var i = 0; i < count; i++) {
          var vmin = min.length > 0 ? min[i] : undefined;
          var vmax = max.length > 0 ? max[i] : undefined;
          var vsquash = squash.length > 0 ? squash[i] : undefined;
          let props = { min: vmin, max: vmax, squash: vsquash };
          let newPalettes = setRangeSelector(
            layerId,
            props,
            i,
            state.palettes[stateObj.groupStr],
            state
          );
          state = update(state, {
            palettes: { [stateObj.groupStr]: { $set: newPalettes } }
          });
        }
      }
    });
  });
  console.log(state);
  return state;
}
