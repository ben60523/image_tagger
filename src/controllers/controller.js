const path = require('path');
const { dialog } = require('electron');

const { promises: fsPromises } = require('fs');

const { autoAnno } = require('../models/auto_anno');

const { FROM_GENERAL } = require('../const');

const SELECT_FOLDER = 'SELECT_FOLDER';
const AUTO_ANNO = 'AUTO_ANNO';

const supportImageSuffix = ['jpg', 'png', 'jpeg'];

module.exports = ({ win, props }) => {
  const sendResponse = (channel, msg) => {
    win.webContents.send(channel, msg);
  };

  const selectFolder = (_args) => {
    const filterImages = (filenames) => filenames.filter((filename) => {
      const lowerCase = filename.toLowerCase();

      for (let i = 0; i < supportImageSuffix.length; i += 1) {
        if (lowerCase.indexOf(supportImageSuffix[i]) !== -1) {
          return true;
        }
      }

      return false;
    });

    const getImageInfo = (name, filePaths) => ({
      name,
      src: path.join(filePaths, name),
      dir: filePaths,
    });

    const getResp = (filenames, filePaths) => ({
      ..._args,
      contents: filterImages(filenames).map((name) => getImageInfo(name, filePaths)),
    });

    const parseFolder = (filePaths) => fsPromises
      .readdir(filePaths)
      .then((filenames) => sendResponse(FROM_GENERAL, getResp(filenames, filePaths)))
      .catch((err) => console.log(err));

    const onSelectIconClicked = () => dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then((resp) => {
        if (resp.canceled !== false) {
          throw new Error('canceled');
        }
        return parseFolder(resp.filePaths[0]);
      })
      .catch((err) => console.log(err));

    // default on select folder button clicked
    if (_args.contents === 'default') {
      return onSelectIconClicked();
    }

    return parseFolder(_args.contents);
  };

  const autoAnnotationImage = (args) => {
    autoAnno(args.contents)
      .then((lacations) => {
        console.log({
          ...args,
          contents: lacations,
        });
        return sendResponse(FROM_GENERAL, {
          ...args,
          contents: lacations,
        });
      })
      .catch((err) => console.error('autoAnnotationImage error', err));
  };

  // switch (props.name) {
  //   case SELECT_FOLDER:
  //     return selectFolder(props);
  //   case AUTO_ANNO:
  //     return autoAnnotationImage(props);
  //   default:
  //     console.log('other request');
  // }
  const { name } = props;
  if (name === SELECT_FOLDER) {
    return selectFolder(props);
  }
  if (name === AUTO_ANNO) {
    return autoAnnotationImage(props);
  }
  console.log('other request');
  return null;
};
