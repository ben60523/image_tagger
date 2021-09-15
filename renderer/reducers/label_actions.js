import CryptoJS from 'crypto-js';
import { UPDATE_LABEL, ADD_NEW_LABEL } from '../constants';

export const createLabel = (label) => ({
  key: `${CryptoJS.SHA256(label.title).toString(CryptoJS.enc.Hex)}`,
  ...label,
});

export const createUpdateLabelAction = (label, contents) => ({
  type: UPDATE_LABEL,
  payload: {
    ...label,
    ...contents,
  },
});

export const addLabel = (labelInfo) => ({
  type: ADD_NEW_LABEL,
  payload: Array.isArray(labelInfo)
    ? labelInfo.map((labelItem) => createLabel(labelItem))
    : [createLabel(labelInfo)],
});
