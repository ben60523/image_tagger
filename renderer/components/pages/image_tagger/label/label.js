import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import EditButton from '../../../common-components/edit_button';

import { usePreferencesContext } from '../../../../stores/preferences_store';

const labelStyle = {
  position: 'relative',
  display: 'flex',
  padding: '3px 10px',
  borderRadius: '5px',
  marginTop: '5px',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export default ({ label, editedLbelID, setEditedLbelID }) => {
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
        onEditBtnClick={() => setEditedLbelID(label.key)}
        onEditDone={onEditDone}
      />
    </div>
  );
};
