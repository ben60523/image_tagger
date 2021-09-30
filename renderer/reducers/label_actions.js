import { v4 as uuidv4 } from 'uuid';
import { UPDATE_LABEL, ADD_NEW_LABEL, IMPORT_LABEL } from '../constants';

export const createLabel = (label) => ({
  key: uuidv4(),
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
