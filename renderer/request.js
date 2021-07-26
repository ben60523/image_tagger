import {
  TO_GENERAL,
  PAGES,
  SELECT_FOLDER,
  TO_MAIN,
  PROJECT_NAME,
} from './constants';

export const FIND_ONE = 'findOne';
export const UPDATE = 'update';
export const FIND = 'find';
export const REMOVE = 'remove';
export const AUTO_ANNO = 'AUTO_ANNO';

export const send2Local = (channel, content) => {
  window.api.send(channel, {
    ...content,
  });
};

export const findOne = (type, contents) => ({
  type,
  name: FIND_ONE,
  contents,
});

export const find = (type, contents) => ({
  type,
  name: FIND,
  contents,
});

export const update = (type, contents) => ({
  type,
  name: UPDATE,
  contents,
});

export const remove = (type, contents) => ({
  type,
  name: REMOVE,
  contents,
});

export const autoAnno = (type, contents) => ({
  type,
  name: AUTO_ANNO,
  contents,
});

export const removeListener = (channel, handler) => {
  window.api.removeListener(channel, handler);
};

export const receive = (channel, handler) => {
  window.api.receive(channel, handler);
};

export const selectFolder = (folder) => {
  send2Local(TO_GENERAL, {
    type: PAGES,
    name: SELECT_FOLDER,
    contents: folder,
  });
};

export const initProject = () => {
  send2Local(TO_MAIN, {
    name: 'FIND_ONE',
    contents: { key: PROJECT_NAME },
  });
};

export const updateWorkingPath = (workingPath) => {
  send2Local(TO_MAIN, {
    name: 'UPDATE',
    contents: {
      name: PROJECT_NAME,
      key: PROJECT_NAME,
      workingPath,
    },
  });
};
