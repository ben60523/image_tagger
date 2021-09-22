import React, { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';

import { usePreferencesContext } from '../../../stores/preferences_store';

const labelStyle = {
  position: 'relative',
  display: 'flex',
  padding: '3px 10px',
  borderRadius: '5px',
  marginTop: '5px',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const EditButton = ({ editMode, setEditedLbelID, onEditDone }) => (
  editMode ? (
    <div
      tabIndex="0"
      role="button"
      onClick={onEditDone}
      onKeyPress={onEditDone}
    >
      Done
    </div>
  ) : (
    <EditIcon
      style={{
        fontSize: '16px',
      }}
      onClick={setEditedLbelID}
    />
  )
);

const NormalLabel = ({ label, editedLbelID, setEditedLbelID }) => {
  const { onSetFocusedLabelID, getFocusedLabel, updateLabelTitle } = usePreferencesContext();
  const [labelInput, setLabelInput] = useState(label.title);

  const onEditDone = () => {
    updateLabelTitle(label, labelInput);
    setEditedLbelID(null);
  };

  return (
    <div
      key={label.key}
      style={labelStyle}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        role="button"
        onClick={() => onSetFocusedLabelID(label.key)}
        onKeyDown={() => null}
        tabIndex={0}
      >
        <span
          className={`icon ${getFocusedLabel().key !== label.key ? 'icon-record' : 'icon-play'}`}
          style={{ color: label.color, marginRight: '5px' }}
        />
        {
          editedLbelID === label.key ? (
            <TextField
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              size="small"
            />
          ) : (label.title)
        }
      </div>
      <EditButton
        editMode={editedLbelID === label.key}
        setEditedLbelID={() => setEditedLbelID(label.key)}
        onEditDone={onEditDone}
      />
    </div>
  );
};

export default () => {
  const { labels, getFocusedLabel } = usePreferencesContext();
  const [editedLbelID, setEditedLbelID] = useState(null);

  return (
    <div>
      <div
        style={{
          padding: '10px 10px 2px',
          fontWeight: '500',
          color: '#666666',
        }}
      >
        Labels
      </div>
      {
        labels.length !== 0 && getFocusedLabel() !== null ? labels
          .map((label) => (
            <NormalLabel
              label={label}
              editedLbelID={editedLbelID}
              setEditedLbelID={setEditedLbelID}
            />
          )) : null
      }
    </div>
  );
};
