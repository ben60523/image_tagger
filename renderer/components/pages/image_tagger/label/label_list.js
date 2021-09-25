import React, { useState } from 'react';
import EditLabe from './edit_label';
import EditButton from '../../../common-components/edit_button';
import Label from './label';
import { usePreferencesContext } from '../../../../stores/preferences_store';
import CreateLabel from './create_label';

const labelStyle = {
  position: 'relative',
  display: 'flex',
  padding: '3px 10px',
  borderRadius: '5px',
  marginTop: '5px',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export default () => {
  const { labels, getFocusedLabel } = usePreferencesContext();
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 10px 2px',
          fontWeight: '500',
          color: '#666666',
        }}
      >
        Labels
        <EditButton
          editMode={editMode}
          onEditBtnClick={() => setEditMode(true)}
          onEditDone={() => setEditMode(false)}
        />
      </div>
      { editMode ? (<CreateLabel />) : null}
      {
        labels.length !== 0 && getFocusedLabel() !== null ? labels
          .map((label) => (
            <div
              key={label.key}
              style={labelStyle}
            >
              { editMode ? <EditLabe label={label} /> : <Label label={label} /> }
            </div>
          )) : null
      }
    </div>
  );
};
