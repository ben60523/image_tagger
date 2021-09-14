import React from 'react';

const PreferencesContext = React.createContext(null);

export const usePreferences = () => {

};

export const PreferencesProvider = ({ children }) => (
  <PreferencesContext.Provider>
    {children}
  </PreferencesContext.Provider>
);

export const usePreferencesContext = () => React.useContext(PreferencesContext);
