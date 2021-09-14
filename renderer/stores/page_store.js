import React, { useReducer, useEffect } from 'react';
import pageReducer from '../reducers/page_reducer';

import {
  receive,
  selectFolder,
  removeListener,
} from '../request';

import {
  pageCreater,
  updatePage,
  importPage,
} from '../reducers/page_actions';

import {
  FROM_GENERAL,
  SELECT_FOLDER,
} from '../constants';

const PageContext = React.createContext(null);

export const usePage = ({ workingPath, setWorkingPath }) => {
  const [pages, dispatchPages] = useReducer(pageReducer, []);

  const addNewPage = (imgs) => {
    if (Array.isArray(imgs)) {
      return addPages(imgs.map((img) => pageCreater(img)));
    }
  
    return null;
  };

  const addPages = (importedPages) => {
    dispatchPages(importPage(importedPages));
  };

  const onUpdatePage = (targetPage) => {
    dispatchPages(updatePage(targetPage));
  };

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

  useEffect(() => {
    receive(FROM_GENERAL, generalListener);

    return () => removeListener(FROM_GENERAL, generalListener);
  }, []);

  useEffect(() => {
    if (workingPath.length !== 0) {
      selectFolder(workingPath);
    }
  }, [workingPath]);

  return {
    pages,
    addNewPage,
    onUpdatePage,
    addPages,
    generalListener,
  };
};

export const PageProvider = ({ workingPath, setWorkingPath, children }) => (
  <PageContext.Provider
    value={usePage({ workingPath, setWorkingPath })}
  >
    {children}
  </PageContext.Provider>
);

export const usePageContext = () => React.useContext(PageContext);
