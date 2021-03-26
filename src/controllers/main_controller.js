const path = require('path');
const { app } = require('electron');

const {
  FROM_MAIN,
  PROJECT_COLLECTION,
} = require("../const");

const config = require('../config');

const Datastore = require('nedb');

const FIND_ONE = 'FIND_ONE';
const UPDATE = 'UPDATE';
const getPathStr = 'appData';

const db = new Datastore({
  filename: path.join(
    app.getPath(getPathStr),
    config.dbPath,
    PROJECT_COLLECTION,
  ),
  autoload: true,
});

module.exports = ({win, props}) => {
  const sendResp = (message) => {
    win.webContents.send(FROM_MAIN, message)
  }

  switch(props.name) {
    case FIND_ONE:
      require('../models/nedb').findOne(db, props)
        .then((resp) => {
          sendResp({
            ...props,
            contents: resp
          })
        })
        .catch((err) => console.log('findProject', err))
      break;
    case UPDATE:
      require('../models/nedb').update(db, props);
      break;
    default:
      console.log('event not found', props);
  }
}