import CryptoJS from 'crypto-js';
import {
  ADD_PAGE,
  UPDATE_PAGE,
  IMPORT_PAGE,
} from './constants';

const IMAGE = 'image';

export const pageCreater = (img, projectName) => ({
  key: `/${CryptoJS.SHA256(img.src).toString(CryptoJS.enc.Hex)}`,
  name: img.name,
  src: img.src,
  type: IMAGE,
  project: projectName,
  tags: [],
});

export const addPage = (page) => ({
  type: ADD_PAGE,
  payload: page,
});

export const updatePage = (page) => ({
  type: UPDATE_PAGE,
  payload: page,
});

export const importPage = (page) => ({
  type: IMPORT_PAGE,
  payload: page,
});
