import { UPDATE_LABEL, ADD_NEW_LABEL } from '../constants';

const replaceLabel = (labels, newLabel) => {
  labels.splice(labels.findIndex((label) => (label.key === newLabel.key)), 1, newLabel);

  return [...labels];
};

const addNewLabel = (preLabels, labels) => (
  [...preLabels, ...labels].sort((a, b) => (a.title > b.title ? 1 : -1))
);

export default (state, action) => {
  switch (action.type) {
    case UPDATE_LABEL:
      return replaceLabel(state, action.payload);
    case ADD_NEW_LABEL:
      return addNewLabel(state, action.payload);
    default:
      return state;
  }
};
