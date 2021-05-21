import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/photon.css';
import ContextStore from '../context_store';

import pageReducer from '../reducers/page_reducer';
import labelReducer from '../reducers/label_reducers';
import { initializeLabel } from '../reducers/label_actions';

import {
  addPage,
  closePage,
  pageCreater,
  updatePage,
} from '../reducers/page_actions';

import Main from './main_pane';
import Header from './header';
import Dialog from '../components/pages/import_dialog';

import {
  update,
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
  SELECT_FILES,
  UPDATE,
  LABELS,
  FIND_ONE,
  TO_GENERAL,
  FROM_GENERAL,
  EXPORT_PROJECT,
  SELECT_FOLDER,
  PAGES,
} from '../constants';

const App = () => {
  const history = useHistory();
  const [pages, dispatch] = useReducer(pageReducer, []);
  const [labels, ldispatch] = useReducer(labelReducer, []);
  const [workingPath, setWorkingPath] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogCtn, setDialogCtn] = useState(null);
  const [filterList, setFilterList] = useState([]);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const initPage = (dbPage) => {
    if (dbPage.length > 0) {
      history.push(dbPage[0].key);
    }

    dbPage.forEach((page) => {
      dispatch(addPage(page));
    });
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
      send2Local(TO_GENERAL, update(PAGES, targetPage));
    };

    const onAutoAnno = (targetPage) => {
      send2Local(TO_GENERAL, autoAnno(PAGES, targetPage));
  };

  const removePage = (removedPage) => {
    if (removedPage.key === history.location.pathname) {
      history.goBack();
    }
    dispatch(closePage(removedPage));
    send2Local(TO_GENERAL, remove(PAGES, { key: removedPage.key }));
  };

  const showOpenDialog = () => {
    send2Local(TO_GENERAL, {
      type: PAGES,
      name: SELECT_FILES,
    });
  };

  const selectFolder = (folder) => {
    send2Local(TO_GENERAL, {
      type: PAGES,
      name: SELECT_FOLDER,
      contents: folder,
    });
  };

  const exportProject = () => {
    send2Local(TO_GENERAL, {
      type: PAGES,
      name: EXPORT_PROJECT,
      contents: {
        workingPath,
      },
    });
  };

  const getProject = () => {
    send2Local(TO_GENERAL, find(PAGES, {}));
  };

  // Initial Project
  useEffect(() => {
    let init = false;
    // Get the preject information from DB
    getProject();

    // Add listener
    receive(FROM_GENERAL, (e, resp) => {
      if (init && resp.name === SELECT_FOLDER) {
        console.log(resp);

        if (resp.options.taggedFile !== null) {
          setOpenDialog(true);
          setDialogCtn(resp.options);
          history.push(
            resp.contents.map((img) => {
              const newPage = pageCreater(img, PROJECT_NAME);

              const mediaIndex = resp.options.taggedFile.findIndex(
                (media) => media.name === img.name,
              );

              newPage.tags = resp.options.taggedFile[mediaIndex].tags;
              dispatch(addPage(newPage));
              send2Local(TO_GENERAL, update(PAGES, newPage));
              return newPage;
            })[0].key,
          );
        } else {
          addNewPage(resp.contents);
        }

        setWorkingPath(resp.contents[0].dir);
      } else if (resp.name === FIND && resp.type === PAGES) {
        // TODO: ADD Initial page
        initPage(resp.contents);
        init = true;
      }
    });

    const getLabels = (e, resp) => {
      if (resp.contents !== null) {
        if (resp.type === LABELS) {
          if (resp.name === FIND) {
            ldispatch(initializeLabel(resp.contents));
          }
        }
      }
    };

    const getDBLabels = () => {
      send2Local(TO_GENERAL, find(LABELS, {}));
      receive(FROM_GENERAL, getLabels);
    };

    getDBLabels();
  }, []);

  useEffect(() => {
    const checkUpdateCtn = (labelList) => {
      for (let i = 0; i < labelList.length; i += 1) {
        if (!labelList[i]) return false;
      }
      return true;
    };

    if (labels.length !== 0 && checkUpdateCtn(labels)) {
      send2Local(
        TO_GENERAL,
        update(
          LABELS,
          labels,
        ),
      );
    }
  }, [labels]);

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
        ldispatch,
        removePage,
        onUpdatePage,
        onAutoAnno,
        workingPath,
        filterList,
        setFilterList,
      }}
    >
      <div className="window">
        <Header
          showOpenDialog={showOpenDialog}
          exportProject={exportProject}
          selectFolder={selectFolder}
        />
        <div className="window-content">
          <Main pages={pages} />
        </div>
      </div>
      <Dialog
        open={openDialog}
        handleClose={handleDialogClose}
        dialogCtn={dialogCtn}
      />
    </ContextStore.Provider>
  );
};

export default App;
