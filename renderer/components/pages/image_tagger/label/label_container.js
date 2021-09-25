import React, { useState } from 'react';
import EditButton from '../../../common-components/edit_button';
import EditLabelList from './edit_label_list';
import LabelList from './label_list';

export default () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 10px 2px 4px',
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
      { editMode ? <EditLabelList /> : <LabelList />}
    </div>
  );
};
