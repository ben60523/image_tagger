import CryptoJS from 'crypto-js';
import { UPDATE_LABEL, ADD_NEW_LABEL, INITIALIZE_LABEL } from '../constants';

export const initializeLabel = (labels) => ({
  type: INITIALIZE_LABEL,
  payload: labels,
});

export const updateLabel = (label, contents) => ({
  type: UPDATE_LABEL,
  payload: {
    ...label,
    ...contents,
  },
});

const createTaggingLabel = (label) => ({
  key: `${CryptoJS.SHA256(label.title).toString(CryptoJS.enc.Hex)}`,
  ...label,
});

export const addNewTaggingLabel = (label) => ({
  type: ADD_NEW_LABEL,
  payload: Array.isArray(label)
    ? label.map((labelItem) => createTaggingLabel(labelItem))
    : createTaggingLabel(label),
});
