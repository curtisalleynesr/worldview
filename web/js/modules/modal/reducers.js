import {
  TOGGLE,
  OPEN_CUSTOM,
  OPEN_BASIC,
  RENDER_TEMPLATE,
  ABOUT_PAGE_REQUEST
} from './constants';
import { requestReducer } from '../core/reducers';
import { assign as lodashAssign } from 'lodash';

const modalState = {
  headerText: '',
  bodyText: '',
  isOpen: false,
  id: '__default__',
  modalClassName: '',
  headerChildren: null,
  bodyHeader: null,
  bodyChildren: null,
  isCustom: false,
  bodyHTML: null,
  customProps: {}
};
export function modalAboutPage(state = {}, action) {
  return requestReducer(ABOUT_PAGE_REQUEST, state, action);
}
export function modalReducer(state = modalState, action) {
  switch (action.type) {
    case TOGGLE:
      return lodashAssign({}, state, {
        isOpen: !state.isOpen
      });
    case OPEN_BASIC:
      return lodashAssign({}, state, {
        isOpen: action.key === state.key ? !state.isOpen : true,
        isCustom: false,
        id: action.key,
        headerText: action.headerText,
        bodyText: action.bodyText,
        customProps: {}
      });
    case OPEN_CUSTOM:
      return lodashAssign({}, state, {
        isOpen: action.key === state.key ? !state.isOpen : true,
        isCustom: true,
        customProps: action.customProps,
        id: action.key,
        headerText: action.headerText,
        bodyText: action.bodyText
      });
    case RENDER_TEMPLATE:
      return lodashAssign({}, state, {
        isOpen: action.key === state.key ? !state.isOpen : true,
        isCustom: false,
        id: action.key,
        headerText: action.headerText,
        bodyText: null,
        template: action.template,
        customProps: {}
      });
    default:
      return state;
  }
}