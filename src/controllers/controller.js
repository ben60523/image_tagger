const path = require('path');
const { dialog } = require('electron');

const { promises: fsPromises } = require('fs');

const { FROM_GENERAL } = require("../const");

const SELECT_FOLDER = 'SELECT_FOLDER';

const supportImageSuffix = ['jpg', 'png', 'jpeg'];

module.exports = ({ win, props }) => {
  const sendResponse = (channel, msg) => {
    win.webContents.send(channel, msg);
  }

  const selectFolder = (props) => {
    const filterImages = (filenames) => filenames.filter(
      (filename) => {
        let lowerCase = filename.toLowerCase();

        for (let i=0; i < supportImageSuffix.length; i = i+1) {
          if (lowerCase.indexOf(supportImageSuffix[i]) !== -1) {
            return true;
          }
        }

        return false;
      }
    )

    const getImageInfo = (name, filePaths) => ({
      name,
      src: path.join(filePaths, name),
      dir: filePaths,
    });

    const getResp = (filenames, filePaths) => ({
      ...props,
      contents: filterImages(filenames).map((name) => getImageInfo(name, filePaths)),
    })

    const parseFolder = (filePaths) => fsPromises.readdir(filePaths)
      .then((filenames) => sendResponse(FROM_GENERAL, getResp(filenames, filePaths)))
      .catch((err) => console.log(err));
    
    const onSelectIconClicked = () => (
      dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then(resp => {
          if (resp.canceled !== false) {
            throw 'canceled';
          }
          return parseFolder(resp.filePaths[0])
        })
        .catch((err) => console.log(err))
    )
    
    // default on select folder button clicked
    if (props.contents === 'default') {
      return onSelectIconClicked();
    }

    return parseFolder(props.contents);
  }

  switch(props.name) {
    case SELECT_FOLDER:
      return selectFolder(props);
    default:
      console.log('other request');
  }
};