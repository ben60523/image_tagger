const path = require('path');
const { dialog } = require('electron');

const {
  readdir,
  readFile,
} = require('../models/fs_handler');

const { autoAnno } = require('../models/auto_anno');

const { FROM_GENERAL } = require("../const");

const SELECT_FOLDER = 'SELECT_FOLDER';
const AUTO_ANNO = 'AUTO_ANNO';

const supportSuffix = ['jpg', 'png', 'jpeg'];

module.exports = ({ win, props }) => {
  const sendResponse = (channel, msg) => {
    win.webContents.send(channel, msg);
  }

  const selectFolder = (props) => {
    const filterSuffix = (filenames) => filenames.filter(
      (filename) => {
        let lowerCase = filename.toLowerCase();

        for (let i=0; i < supportSuffix.length; i = i+1) {
          if (lowerCase.indexOf(supportSuffix[i]) !== -1) {
            return true;
          }
        }

        return false;
      }
    )

    const parseName = (name, filePaths) => ({
      name,
      src: path.join(filePaths, name),
      dir: filePaths,
    });

    const getContents = (fileName, filePaths) => {
      return readFile(path.join(filePaths, fileName))
        .then((resp) => JSON.parse(resp))
        .catch((err) => console.log(err));
    }

    const checkLabelCol = (filenames, filePaths) => {
      const labelColName = 'labels.json';

      if (filenames.indexOf(labelColName) !== -1) {
        return getContents(labelColName, filePaths);
      }

      return null;
    }

    const checkPageCol = (filenames, filePaths) => {
      const pageColName = 'pages.json';

      if (filenames.indexOf(pageColName) !== -1) {
        return getContents(pageColName, filePaths);
      }

      return null;
    }

    const parseFolder = (filePaths) => readdir(filePaths)
      .then( async (filenames) => {
        const labelImportContents = await checkLabelCol(filenames, filePaths);
        const pageImportContents = await checkPageCol(filenames, filePaths);

        const respCtn = {
          ...props,
          contents: filterSuffix(filenames).map(
            (name) => parseName(name, filePaths)
          ),
          options: {
            label: labelImportContents,
            taggedFile: pageImportContents,
          }
        }

        // console.log(respCtn.options);

        return sendResponse(
          FROM_GENERAL, 
          respCtn,
        );
      })
      .catch((err) => console.log(err))
    
    if (props.contents === 'default') {
      return dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then(resp => {
          if (resp.canceled !== false) {
            throw 'canceled';
          }
          return parseFolder(resp.filePaths[0])
        })
        .catch((err) => console.log(err));
    }

    return parseFolder(props.contents);
  }

  const autoAnnotationImage = (props) => {
    autoAnno(props.contents)
      .then(lacations => {
        console.log({
          ...props,
          contents: lacations                                                                                                                                                                                                                                                                                                                                                                                                 
        });
        return sendResponse(
          FROM_GENERAL,
          {
            ...props,
            contents: lacations                                                                                                                                                                                                                                                                                                                                                                                                 
          }
        );
      })
      .catch(err => console.error('autoAnnotationImage error'))
  }

  switch(props.name) {
    case SELECT_FOLDER:
      return selectFolder(props);
    case AUTO_ANNO:
      return autoAnnotationImage(props);
    default:
      console.log('other request');
  }
};