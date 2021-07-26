import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/photon.css';

import ContextStore from '../context_store';

import pageReducer from '../reducers/page_reducer';
import labelReducer from '../reducers/label_reducers';
import { addNewTaggingLabel } from '../reducers/label_actions';
import defaultabel from '../reducers/default_label';

import {
  addPage,
  pageCreater,
  updatePage,
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
  FROM_GENERAL,
  SELECT_FOLDER,
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

  // Create a page object when select folder request returns the file names.
  const addNewPage = (imgs) => {
    const createMultiPages = () => {
      history.push(
        imgs.map((img) => {
          const newPage = pageCreater(img);
          dispatch(addPage(newPage));
          return newPage;
        })[0].key,
      );
    };

    if (Array.isArray(imgs)) {
      createMultiPages();
    } else {
      dispatch(addPage(pageCreater(imgs)));
    }
  };

  // update the page in react
  const onUpdatePage = (targetPage) => {
    dispatch(updatePage(targetPage));
  };

  // Initial Project
  useEffect(() => {
    const generalListener = (e, resp) => {
      const onSelectFolder = () => {
        addNewPage(resp.contents);

        setWorkingPath(resp.contents[0].dir);
        return null;
      };

      switch (resp.name) {
        case SELECT_FOLDER:
          return onSelectFolder(resp);
        default:
          console.log('event not found', resp);
      }

      return null;
    };

    // Get the preject information from DB
    initLabels();

    // Add listener
    receive(FROM_GENERAL, generalListener);
  }, []);

  useEffect(() => {
    // Get the working path and get the file names in that folder
    const getProjectConfig = (e, resp) => {
      setWorkingPath(resp.contents.workingPath);
      selectFolder(resp.contents.workingPath);
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
      }}
    >
      <div className="window">
        <Header
          exportProject={() => exportProject(pages, labels, workingPath)}
          selectFolder={selectFolder}
          workingPath={workingPath}
        />
        <div className="window-content">
          <div className="pane">
            <div className="pane-group">
              <SideBar
                pages={pages}
                filterList={filterList}
                setFilterList={setFilterList}
                workingPath={workingPath}
              />
              <Main pages={pages} />
            </div>
          </div>
        </div>
      </div>
    </ContextStore.Provider>
  );
};

export default App;
