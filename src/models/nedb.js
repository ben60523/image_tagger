module.exports = (() => {
  const insert = (db, props) => {
    return new Promise((resolve, reject) => {
      db.insert(props.contents, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })
  }

  const update = (db, props) => {
    const dbUpdate = (item) => {
      return new Promise((resolve, reject) => {   
        db.update({key: item.key}, item, { returnUpdatedDocs: true }, (err, numReplace, affectedDocuments) => {
          if (err) reject(err);
          resolve(affectedDocuments);
        })
      })
        .then((resp) => {
          if (resp === undefined) return insert(db, { contents: item });
          return resp;
        })
    };

    if (Array.isArray(props.contents)) {
      return Promise.all(props.contents.map((item) => {
        dbUpdate(item);
      }))
    } else {
      return dbUpdate(props.contents);
    }
  }

  const findOne = (db, props) => {
    return new Promise((resolve, reject) => {
      db.findOne(props.contents, (err, doc) => {
        if(err) reject(err);
        resolve(doc);
      })
    })
  }

  const find = (db, props) => {
    return new Promise((resolve, reject) => {
      db.find(props.contents, (err, docs) => {
        if(err) reject(err);
        resolve(docs);
      })
    });
  }

  const remove = (db, props) => {
    return new Promise((resolve, reject) => {
      db.remove(props.contents, {}, (err, docs) => {
        if(err) reject(err);
        resolve(docs);
      })
    });
  };

  return {
    insert,
    findOne,
    update,
    find,
    remove,
  }
})()