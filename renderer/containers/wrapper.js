import React, { useReducer, useEffect, useState } from 'react';
import '../assets/css/photon.css';

import ContextStore from '../context_store';
import { PageProvider } from '../stores/page_store';

import labelReducer from '../reducers/label_reducer';
import { addNewTaggingLabel } from '../reducers/label_actions';
import defaultabel from '../reducers/default_label';

import Main from './main_pane';
import Header from './header';
import SideBar from './sidebar';

import {
  receive,
  selectFolder,
  initProject,
  updateWorkingPath,
} from '../request';

import {
  FROM_MAIN,
} from '../constants';

const App = () => {
  const [labels, ldispatch] = useReducer(labelReducer, []);
  const [workingPath, setWorkingPath] = useState('');
  const [filterList, setFilterList] = useState([]);

  // Set the default labels as the initial label
  const initLabels = () => {
    ldispatch(addNewTaggingLabel(defaultabel));
  };

  // Initial Project
  useEffect(() => {
    // Get the preject information from DB
    initLabels();
  }, []);

  useEffect(() => {
    // Get the working path and get the file names in that folder
    const getProjectConfig = (e, resp) => {
      const { workingPath: workingFolder } = resp.contents;
      if (workingFolder.indexOf('.zip') !== -1) {
        setWorkingPath('');
        return null;
      }
      setWorkingPath(workingFolder);
      return null;
    };

    if (workingPath.length !== 0) {
      updateWorkingPath(workingPath);
    } else {
      initProject();
      receive(FROM_MAIN, getProjectConfig);
    }
  }, [workingPath]);

  return (
    <ContextStore.Provider
      value={{
        labels,
        setWorkingPath,
      }}
    >
      <PageProvider workingPath={workingPath} setWorkingPath={setWorkingPath}>
        <div className="window">
          <Header
            labels={labels}
            selectFolder={selectFolder}
            workingPath={workingPath}
            setWorkingPath={setWorkingPath}
          />
          <div className="window-content">
            <div className="pane">
              <div className="pane-group">
                <SideBar
                  filterList={filterList}
                  setFilterList={setFilterList}
                />
                <Main />
              </div>
            </div>
          </div>
        </div>
      </PageProvider>
    </ContextStore.Provider>
  );
};

export default App;
