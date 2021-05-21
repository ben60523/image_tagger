const path = require('path');
const { dialog } = require('electron');
const moment = require('moment');

const {
  syncMediaStore,
  createFolder,
  writeFile,
  readdir,
  readFile,
} = require('../models/fs_handler');

const { autoAnno } = require('../models/auto_anno');

const {
  FROM_GENERAL,
} = require("../const");

const SELECT_FILES = 'SELECT_FILES';
const EXPORT_PROJECT = 'EXPORT_PROJECT';
const SELECT_FOLDER = 'SELECT_FOLDER';
const AUTO_ANNO = 'AUTO_ANNO';

const supportSuffix = ['jpg', 'png', 'jpeg'];

module.exports = ({win, props, db, logger}) => {
  const sendResponse = (channel, msg) => {
    win.webContents.send(channel, msg);
  }

  const getDB = (props) => (
    props.type === 'pages'
      ? db.page
      : db.label
  )

  const selectFiles = (props) => {
    return dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }]
    })
      .then(resp => {
        if (!resp.canceled) {
          return sendResponse(
            FROM_GENERAL, 
            {
              ...props,
              contents: resp.filePaths
            }
          );
        }
      })
      .catch((err) => console.log(err));
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

  const exportProject = async (props) => {
    try {
      let filePathName = '';

      if (props.contents.workingPath) {
        let parsePath = props.contents.workingPath.split(path.sep);
        filePathName = parsePath[parsePath.length - 1];
      }

      let dest = await dialog.showSaveDialog({
        title: 'Export Destination',
        buttonLabel: 'Export',
        properties: ['openDirectory'],
        defaultPath: `${filePathName}_${moment(new Date()).format('YYYYMMDD_HHmmss')}`,
      })

      if (dest.canceled === false) {
        let dbPage = await require('../models/nedb').find(db.page, {})
        let taggedPages = await dbPage.filter((page) => page.tags.length > 0);
        if (props.contents.workingPath) {
          taggedPages = await taggedPages.filter(
            (page) => page.src.indexOf(props.contents.workingPath) !== -1 
          );
        }

        await createFolder(dest.filePath);
        await syncMediaStore(taggedPages, dest.filePath);
        let dblabel = await require('../models/nedb').find(db.label, {});
    
        writeFile(path.join(dest.filePath, 'pages.json'), JSON.stringify(taggedPages));
        writeFile(path.join(dest.filePath, 'labels.json'), JSON.stringify(dblabel));
      }
    } catch (error) {
      console.log('dest', dest.filePath);
      console.log('dbPage', JSON.stringify(dbPage));
      console.log('dblabel', JSON.stringify(dblabel));
      throw error;
    }
  }

  switch(props.name) {
    case SELECT_FILES:
      return selectFiles(props);
    case SELECT_FOLDER:
      return selectFolder(props);
    case EXPORT_PROJECT:
      return exportProject(props);
    case AUTO_ANNO:
      return autoAnno(props);
    default:
      require('../models/nedb')[props.name](getDB(props), props)
        .then((resp) => {
          sendResponse(
            FROM_GENERAL,
            {
              ...props,
              contents: resp,
            }
          );

          if (props.type === 'pages' && props.name === 'update') {
            // if (resp.hasOwnProperty('src')) {
            //   copyFiles(resp.src, mediaStorePath);
            // };

            logger.log({
              level: 'info',
              message: 'update/insert page',
              contents: props,
              position: 'controller.js',
              createAt: new Date(),
            });
          } else if (props.type === 'pages' && props.name === 'find') {
            // syncMediaStore(resp, mediaStorePath);
          }
        })
        .catch((err) => { console.log(err) })
  }
};