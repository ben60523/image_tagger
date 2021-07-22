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

import {
  send2Local,
  receive,
  find,
} from '../request';

import {
  TO_MAIN,
  FROM_MAIN,
  PROJECT_NAME,
  UPDATE,
  FIND_ONE,
  TO_GENERAL,
  FROM_GENERAL,
  SELECT_FOLDER,
  PAGES,
} from '../constants';

import { exportProject } from '../utils';

const App = () => {
  const history = useHistory();
  const [pages, dispatch] = useReducer(pageReducer, []);
  const [labels, ldispatch] = useReducer(labelReducer, []);
  const [workingPath, setWorkingPath] = useState('');
  const [filterList, setFilterList] = useState([]);

  const initLabels = () => {
    ldispatch(addNewTaggingLabel(defaultabel));
  };

  const addNewPage = (imgs) => {
    if (Array.isArray(imgs)) {
      history.push(
        imgs.map((img) => {
          const newPage = pageCreater(img);
          dispatch(addPage(newPage));
          return newPage;
        })[0].key,
      );
    } else {
      dispatch(addPage(pageCreater(imgs)));
    }
  };

  const onUpdatePage = (targetPage) => {
    dispatch(updatePage(targetPage));
    // send2Local(TO_GENERAL, update(PAGES, targetPage));
  };

  const selectFolder = (folder) => {
    send2Local(TO_GENERAL, {
      type: PAGES,
      name: SELECT_FOLDER,
      contents: folder,
    });
  };

  const getProject = () => {
    send2Local(TO_GENERAL, find(PAGES, {}));
  };

  // Initial Project
  useEffect(() => {
    // Get the preject information from DB
    getProject();
    initLabels();

    // Add listener
    receive(FROM_GENERAL, (e, resp) => {
      const onSelectFolder = () => {
        addNewPage(resp.contents);

        setWorkingPath(resp.contents[0].dir);
        return null;
      };

      switch (resp.name) {
        case SELECT_FOLDER:
          return onSelectFolder(resp);
        default:
          // console.log('event not found', resp);
      }

      return null;
    });
  }, []);

  useEffect(() => {
    const getProjectConfig = (e, resp) => {
      setWorkingPath(resp.contents.workingPath);
      selectFolder(resp.contents.workingPath);
    };

    if (workingPath.length !== 0) {
      send2Local(TO_MAIN, {
        name: UPDATE,
        contents: {
          name: PROJECT_NAME,
          key: PROJECT_NAME,
          workingPath,
        },
      });
    } else {
      send2Local(TO_MAIN, {
        name: FIND_ONE,
        contents: { key: PROJECT_NAME },
      });

      receive(FROM_MAIN, getProjectConfig);
    }
  }, [workingPath]);

  return (
    <ContextStore.Provider
      value={{
        labels,
        onUpdatePage,
        workingPath,
        filterList,
        setFilterList,
      }}
    >
      <div className="window">
        <Header
          exportProject={() => exportProject(pages, labels, workingPath)}
          selectFolder={selectFolder}
        />
        <div className="window-content">
          <Main pages={pages} />
        </div>
      </div>
    </ContextStore.Provider>
  );
};

export default App;
