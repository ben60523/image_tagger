import React, { useReducer, useEffect, useState } from 'react';
import labelReducer from '../reducers/label_reducer';
import { addLabelAction, updateLabelAction } from '../reducers/label_actions';
import defaultLabels from '../reducers/default_label';

const PreferencesContext = React.createContext(null);

export const usePreferences = () => {
  const [labels, dispatchLabels] = useReducer(labelReducer, []);
  const [focusedLabelID, setFocusedLabelID] = useState(null);

  const isValidColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;

    // return 'false' if color wasn't assigned
    return s.color !== '';
  };

  const isString = (title) => typeof title === 'string';

  const titlehasExisted = (title) => {
    const index = labels.findIndex((label) => title === label.title);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  const checkNewLabel = (newLabelInfo) => {
    if (
      isString(newLabelInfo.title)
      && isValidColor(newLabelInfo.color)
      && !titlehasExisted(newLabelInfo.title)
    ) {
      return true;
    }
    return false;
  };

  const createLabel = (newLabelInfo) => {
    if (checkNewLabel(newLabelInfo)) {
      dispatchLabels(addLabelAction(newLabelInfo));
    }
  };

  // Add some logic for checking the contents
  const updateLabel = (newLabel) => {
    dispatchLabels(updateLabelAction(newLabel));
  };

  const updateLabelColor = (label, newTitle) => {
    if (
      isString(newTitle)
      && !titlehasExisted(newTitle)
    ) {
      updateLabel({
        ...label,
        title: newTitle,
      });
    }
  };

  const updateLabelTitle = (label, updatedColor) => {
    if (isValidColor(updatedColor)) {
      updateLabel({
        ...label,
        color: updatedColor,
      });
    }
  };

  const initLabels = () => {
    const result = defaultLabels.reduce((newLabelsArray, currentlabel) => {
      if (checkNewLabel(currentlabel)) {
        newLabelsArray.push(currentlabel);
      }
      return newLabelsArray;
    }, []);

    dispatchLabels(addLabelAction(result));
  };

  const getLabelByID = (id) => labels.find((label) => label.key === id);

  const getFocusedLabel = () => getLabelByID(focusedLabelID);

  const onSetFocusedLabelID = (key) => {
    setFocusedLabelID(key);
  };

  // Initial Project
  useEffect(() => {
    // Get the preject information from DB
    initLabels();
  }, []);

  useEffect(() => {
    if (Array.isArray(labels) && labels.length > 0) {
      setFocusedLabelID(labels[0].key);
    }
  }, [labels]);

  return {
    labels,
    createLabel,
    updateLabelColor,
    updateLabelTitle,
    getLabelByID,
    getFocusedLabel,
    onSetFocusedLabelID,
  };
};

export const PreferencesProvider = ({ children }) => (
  <PreferencesContext.Provider
    value={usePreferences()}
  >
    {children}
  </PreferencesContext.Provider>
);

export const usePreferencesContext = () => React.useContext(PreferencesContext);
