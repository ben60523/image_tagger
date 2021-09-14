const { FROM_MAIN } = require('../const');
const nedb = require('../models/nedb');

const FIND_ONE = 'FIND_ONE';
const UPDATE = 'UPDATE';

module.exports = ({ win, db, props }) => {
  const sendResp = (message) => {
    win.webContents.send(FROM_MAIN, message);
  };

  switch (props.name) {
    case FIND_ONE:
      nedb
        .findOne(db, props)
        .then((resp) => {
          sendResp({
            ...props,
            contents: resp,
          });
        })
        .catch((err) => console.log('findProject', err));
      break;
    case UPDATE:
      nedb.update(db, props);
      break;
    default:
      console.log('event not found', props);
  }
};
