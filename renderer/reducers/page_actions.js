import CryptoJS from 'crypto-js';
import {
  UPDATE_PAGE,
  IMPORT_PAGE,
} from '../constants';

const IMAGE = 'image';

export const pageCreator = (img) => ({
  key: `/${CryptoJS.SHA256(img.src).toString(CryptoJS.enc.Hex)}`,
  name: img.name,
  src: img.src,
  type: IMAGE,
  tags: [],
});

export const updatePage = (page) => ({
  type: UPDATE_PAGE,
  payload: page,
});

export const importPage = (page) => ({
  type: IMPORT_PAGE,
  payload: page,
});
