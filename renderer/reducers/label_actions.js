import CryptoJS from 'crypto-js';
import { UPDATE_LABEL, ADD_NEW_LABEL, IMPORT_LABEL } from '../constants';

export const createLabel = (label) => ({
  key: `${CryptoJS.SHA256(label.title).toString(CryptoJS.enc.Hex)}`,
  ...label,
});

export const updateLabelAction = (newLabel) => ({
  type: UPDATE_LABEL,
  payload: newLabel,
});

export const addLabelAction = (labelInfo) => ({
  type: ADD_NEW_LABEL,
  payload: Array.isArray(labelInfo)
    ? labelInfo.map((labelItem) => createLabel(labelItem))
    : [createLabel(labelInfo)],
});

export const importLabelAction = (labelList) => ({
  type: IMPORT_LABEL,
  payload: labelList,
});
