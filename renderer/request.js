import {
  TO_GENERAL,
  SELECT_FOLDER,
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
