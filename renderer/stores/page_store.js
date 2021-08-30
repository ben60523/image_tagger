import React, { useReducer, useEffect } from 'react';
import pageReducer from '../reducers/page_reducer';

import {
  receive,
  selectFolder,
  removeListener,
} from '../request';

import {
  pageCreater,
  // updatePage,
  importPage,
} from '../reducers/page_actions';

import {
  FROM_GENERAL,
  SELECT_FOLDER,
} from '../constants';

const PageContext = React.createContext(null);

export const PageProvider = ({ workingPath, children }) => {
  const [pages, dispatchPages] = useReducer(pageReducer, []);

  const addNewPage = (imgs) => {
    const createMultiPages = () => {
      dispatchPages(importPage(imgs.map((img) => pageCreater(img))));
    };

    if (Array.isArray(imgs)) {
      return createMultiPages();
    }

    return null;
  };

  useEffect(() => {
    const generalListener = (e, resp) => {
      const onSelectFolder = () => {
        addNewPage(resp.contents);

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

    // Add listener
    receive(FROM_GENERAL, generalListener);

    return () => removeListener(FROM_GENERAL, generalListener);
  }, []);

  useEffect(() => {
    if (workingPath.length !== 0) {
      selectFolder(workingPath);
    }
  }, [workingPath]);

  return (
    <PageContext.Provider
      value={{
        pages,
        dispatchPages,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => React.useContext(PageContext);
