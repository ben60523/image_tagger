import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/photon.css';
import JSZip from 'jszip';
import moment from 'moment';
import { saveAs } from 'file-saver';

import ContextStore from '../context_store';

import pageReducer from '../reducers/page_reducer';
import labelReducer from '../reducers/label_reducers';
import { addNewTaggingLabel } from '../reducers/label_actions';
import defaultabel from '../reducers/default_label';

import {
  addPage,
  closePage,
  pageCreater,
  updatePage,
} from '../reducers/page_actions';

import Main from './main_pane';
import Header from './header';

import {
  send2Local,
  receive,
  FIND,
  find,
  remove,
  autoAnno,
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
  AUTO_ANNO,
} from '../constants';

const App = () => {
  const history = useHistory();
  const [pages, dispatch] = useReducer(pageReducer, []);
  const [labels, ldispatch] = useReducer(labelReducer, []);
  const [workingPath, setWorkingPath] = useState('');
  const [filterList, setFilterList] = useState([]);

  const initPage = (dbPage) => {
    if (dbPage.length > 0) {
      history.push(dbPage[0].key);
    }

    dbPage.forEach((page) => {
      dispatch(addPage(page));
    });
  };

  const initLabels = () => {
    ldispatch(addNewTaggingLabel(defaultabel));
  };

  const addNewPage = (imgs) => {
    if (Array.isArray(imgs)) {
      history.push(
        imgs.map((img) => {
          const newPage = pageCreater(img, PROJECT_NAME);
          dispatch(addPage(newPage));
          return newPage;
        })[0].key,
      );
    } else {
      dispatch(addPage(pageCreater(imgs, PROJECT_NAME)));
    }
  };

  const onUpdatePage = (targetPage) => {
    dispatch(updatePage(targetPage));
    // send2Local(TO_GENERAL, update(PAGES, targetPage));
  };

  const onAutoAnnoClick = (targetPage) => {
    send2Local(TO_GENERAL, autoAnno(PAGES, targetPage));
  };

  const selectFolder = (folder) => {
    send2Local(TO_GENERAL, {
      type: PAGES,
      name: SELECT_FOLDER,
      contents: folder,
    });
  };

  const exportProject = () => {
    const findPagesInWorkingPath = (page) => {
      if (page.src.indexOf(workingPath) !== -1) {
        return true;
      }

      return false;
    };

    const haveSnapshot = (page) => {
      console.log(page);
      if (page.snapshot) {
        return true;
      }

      return false;
    };

    const zip = new JSZip();

    const img = zip.folder('images');

    const result = pages.filter(findPagesInWorkingPath)
      .filter(haveSnapshot)
      .map((page) => {
        const commaIndex = page.snapshot.indexOf(',');
        img.file(page.name, page.snapshot.slice(commaIndex + 1), { base64: true });

        return page;
      });

    console.log(result);

    zip.generateAsync({ type: 'blob' })
      .then((ctn) => saveAs(ctn, `${moment(new Date()).format('YYYYMMDD_HHmmss')}.zip`));
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

      const onFind = () => {
        if (resp.type !== PAGES) {
          return null;
        }

        initPage(resp.contents);

        return null;
      };

      switch (resp.name) {
        case SELECT_FOLDER:
          return onSelectFolder(resp);
        case FIND:
          return onFind();
        case AUTO_ANNO:
          if (Array.isArray(resp.contents.tags) && resp.contents.tags.length !== 0) {
            onUpdatePage(resp.contents);
          }
          break;
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
        projectName: PROJECT_NAME,
        labels,
        onUpdatePage,
        onAutoAnnoClick,
        workingPath,
        filterList,
        setFilterList,
      }}
    >
      <div className="window">
        <Header
          exportProject={exportProject}
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
