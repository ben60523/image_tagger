import { UPDATE_LABEL, ADD_NEW_LABEL } from '../constants';

const getNewLabelList = (labels, newLabel) => {
  labels.splice(labels.findIndex((label) => (label.key === newLabel.key)), 1, newLabel);

  return [...labels];
};

const addNewLabel = (preLabels, newlabels) => {
  const isValidColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;

    // return 'false' if color wasn't assigned
    return s.color !== '';
  };

  const isString = (title) => typeof title === 'string';

  const titlehasExisted = (newlabel) => {
    const index = preLabels.findIndex((label) => newlabel.title === label.title);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  const checkNewLabel = () => {
    const indexOfInValidLabel = newlabels.findIndex((label) => {
      if (
        isString(label.title)
        && isValidColor(label.color)
        && !titlehasExisted(label)
      ) {
        return false;
      }
      return true;
    });

    if (indexOfInValidLabel !== -1) {
      return false;
    }

    return true;
  };

  if (checkNewLabel()) {
    return [...preLabels, ...newlabels].sort((a, b) => (a.title > b.title ? 1 : -1));
  }

  return preLabels;
};

export default (state, action) => {
  switch (action.type) {
    case UPDATE_LABEL:
      return getNewLabelList(state, action.payload);
    case ADD_NEW_LABEL:
      return addNewLabel(state, action.payload);
    default:
      return state;
  }
};
