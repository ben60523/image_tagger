import { UPDATE_LABEL, ADD_NEW_LABEL, INITIALIZE_LABEL } from '../constants';

const getNewLabelList = (labels, newLabel) => {
  labels.splice(labels.findIndex((label) => (label.key === newLabel.key)), 1, newLabel);

  return [...labels];
};

const addNewLabel = (preLabels, label) => {
  if (Array.isArray(label)) {
    return [...preLabels, ...label];
  }

  return [...preLabels, label];
};

export default (state, action) => {
  switch (action.type) {
    case UPDATE_LABEL:
      return getNewLabelList(state, action.payload);
    case ADD_NEW_LABEL:
      return addNewLabel(state, action.payload);
    case INITIALIZE_LABEL:
      return [...action.payload];
    default:
      return state;
  }
};
