import React, { useState, useEffect, useContext } from 'react';

import ContextStore from '../../../context_store';
// import EditBar from './edit_bar';

import { addNewTaggingLabel } from '../../../reducers/label_actions';
import defaultabel from '../../../reducers/default_label';

// const PENCIL = 'pencil';
const AUTO_GENERATE = 'auto_gen';

export default ({ setTagConfig }) => {
  // const [enteredLabel, setEnteredLabel] = useState(null);
  const { labels, ldispatch, projectName } = useContext(ContextStore);
  const [focusedLabel, setFocusLabel] = useState(labels[0]);
  const [currentInput, setCurrentInput] = useState('');
  const [editedLabel] = useState(null);

  const updateCurrentLabel = (selectedLabel) => {
    if (editedLabel === null && selectedLabel.describe !== AUTO_GENERATE) {
      setTagConfig(selectedLabel);
      setFocusLabel(selectedLabel);
    }
  };

  // const saveLabel = (e, selectedLabel) => {
  //   if (e.keyCode === 13) {
  //     if (editedLabel !== null && currentInput.length !== 0) {
  //       ldispatch(updateLabel(selectedLabel, { title: currentInput }));
  //     }
  //     setEditedLabel(null);
  //   }
  // };

  // const editLabel = (e, selectedLabel) => {
  //   setCurrentInput(selectedLabel.title);
  //   if (e.target.className.includes(PENCIL)) {
  //     setEditedLabel(selectedLabel.key);
  //   } else if (e.button === 2) setEditedLabel(selectedLabel.key);
  //   else if (editedLabel !== selectedLabel.key) {
  //     setEditedLabel(null);
  //   }
  // };

  // const getEditBar = (label) => {
  //   if (enteredLabel && editedLabel === null) {
  //     return enteredLabel.key === label.key
  //       ? <EditBar name={PENCIL} />
  //       : null;
  //   }

  //   return null;
  // };

  const taggingLabelFilter = (label) => label.type === 'tagging';

  const projectFilter = (label) => (
    label.project === 'default' || label.project === projectName
  );

  useEffect(() => {
    setTagConfig(focusedLabel);
  }, [focusedLabel]);

  useEffect(() => {
    if (labels.filter(taggingLabelFilter).length !== 0) {
      if (labels[0].describe !== AUTO_GENERATE) {
        setFocusLabel(labels[0]);
      } else {
        setFocusLabel(labels[1]);
      }
    } else {
      const action = addNewTaggingLabel(defaultabel);
      setFocusLabel(action.payload[0]);
      ldispatch(action);
    }
  }, []);

  return (
    <div>
      <h5 className="nav-group-title">
        Labels
      </h5>
      {
        labels.length !== 0 ? labels
          .filter(taggingLabelFilter)
          .filter(projectFilter)
          .sort((a, b) => (a.title > b.title ? 1 : -1))
          .map((label) => (
            <div
              key={label.key}
              role="button"
              style={{
                position: 'relative',
                display: 'flex',
                padding: '3px 10px',
                borderRadius: '5px',
                marginTop: '5px',
                alignItems: 'center',
              }}
              onClick={() => updateCurrentLabel(label)}
              // onMouseDown={(e) => editLabel(e, label)}
              // onMouseEnter={() => setEnteredLabel(label)}
              // onMouseLeave={() => setEnteredLabel(null)}
              onKeyDown={() => console.log('key down')}
              tabIndex={0}
            >
              <span
                className={`icon ${focusedLabel.key !== label.key ? 'icon-record' : 'icon-play'}`}
                style={{ color: label.color, marginRight: '5px' }}
              />
              {
                editedLabel === label.key
                  ? (
                    <input
                      className="form-control"
                      style={{ padding: '3px 7px' }}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      type="text"
                      placeholder={label.title}
                    />
                  )
                  : label.title
              }
              {/* { getEditBar(label) } */}
            </div>
          )) : null
      }
    </div>
  );
};
