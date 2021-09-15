import React, { useReducer } from 'react';
import labelReducer from '../reducers/label_reducer';
import { addLabel, createUpdateLabelAction } from '../reducers/label_actions';
import defaultLabels from '../reducers/default_label';

const PreferencesContext = React.createContext(null);

export const usePreferences = () => {
  const [labels, dispatchLabels] = useReducer(labelReducer, defaultLabels);

  const createLabel = (newLabelInfo) => {
    dispatchLabels(addLabel(newLabelInfo));
  };

  // Add some logic for checking the contents
  const updateLabel = (label, updatedContents) => {
    dispatchLabels(createUpdateLabelAction(label, updatedContents));
  };

  return {
    labels,
    dispatchLabels,
    createLabel,
    updateLabel,
  };
};

export const PreferencesProvider = ({ children }) => (
  <PreferencesContext.Provider>
    {children}
  </PreferencesContext.Provider>
);

export const usePreferencesContext = () => React.useContext(PreferencesContext);
