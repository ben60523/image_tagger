import {
  TO_GENERAL,
  SELECT_FOLDER,
  TO_MAIN,
  PROJECT_NAME,
  FIND_ONE,
  UPDATE,
} from './constants';

export const send2Local = (channel, content) => {
  window.api.send(channel, {
    ...content,
  });
};

export const removeListener = (channel, handler) => {
  window.api.removeListener(channel, handler);
};

export const receive = (channel, handler) => {
  window.api.receive(channel, handler);
};

export const selectFolder = (folder) => {
  send2Local(TO_GENERAL, {
    name: SELECT_FOLDER,
    contents: folder,
  });
};

export const initProject = () => {
  send2Local(TO_MAIN, {
    name: FIND_ONE,
    contents: { key: PROJECT_NAME },
  });
};

export const updateWorkingPath = (workingPath) => {
  send2Local(TO_MAIN, {
    name: UPDATE,
    contents: {
      name: PROJECT_NAME,
      key: PROJECT_NAME,
      workingPath,
    },
  });
};
