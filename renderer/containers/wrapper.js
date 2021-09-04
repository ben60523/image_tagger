import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/photon.css';

import ContextStore from '../context_store';
import { PageProvider } from '../stores/page_store';

import pageReducer from '../reducers/page_reducer';
import labelReducer from '../reducers/label_reducers';
import { addNewTaggingLabel } from '../reducers/label_actions';
import defaultabel from '../reducers/default_label';

import {
  updatePage,
  importPage,
} from '../reducers/page_actions';

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

import { exportProject } from '../utils';

const App = () => {
  const history = useHistory();
  const [pages, dispatch] = useReducer(pageReducer, []);
  const [labels, ldispatch] = useReducer(labelReducer, []);
  const [workingPath, setWorkingPath] = useState('');
  const [filterList, setFilterList] = useState([]);

  // Set the default labels as the initial label
  const initLabels = () => {
    ldispatch(addNewTaggingLabel(defaultabel));
  };

  const importPageToReducer = (zipInfo) => {
    dispatch(importPage(zipInfo.pages));
    history.push(zipInfo.pages[0].key);
    setWorkingPath(zipInfo.zipFile.path);
  };

  // update the page in react
  const onUpdatePage = (targetPage) => {
    dispatch(updatePage(targetPage));
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
        onUpdatePage,
        setWorkingPath,
      }}
    >
      <PageProvider
        workingPath={workingPath}
        setWorkingPath={setWorkingPath}
      >
        <div className="window">
          <Header
            exportProject={() => exportProject(pages, labels)}
            selectFolder={selectFolder}
            workingPath={workingPath}
            importPage={importPageToReducer}
          />
          <div className="window-content">
            <div className="pane">
              <div className="pane-group">
                <SideBar
                  filterList={filterList}
                  setFilterList={setFilterList}
                />
                <Main pages={pages} />
              </div>
            </div>
          </div>
        </div>
      </PageProvider>
    </ContextStore.Provider>
  );
};

export default App;
