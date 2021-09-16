import React, { useReducer, useEffect, useState } from 'react';
import labelReducer from '../reducers/label_reducer';
import { addLabel, createUpdateLabelAction } from '../reducers/label_actions';
import defaultLabels from '../reducers/default_label';

const PreferencesContext = React.createContext(null);

export const usePreferences = () => {
  const [labels, dispatchLabels] = useReducer(labelReducer, []);
  const [focusedLabelID, setFocusedLabelID] = useState(null);

  const createLabel = (newLabelInfo) => {
    dispatchLabels(addLabel(newLabelInfo));
  };

  // Add some logic for checking the contents
  const updateLabel = (label, updatedContents) => {
    dispatchLabels(createUpdateLabelAction(label, updatedContents));
  };

  const initLabels = () => {
    dispatchLabels(addLabel(defaultLabels));
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
    updateLabel,
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
