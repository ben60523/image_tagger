import React from 'react';
import EditIcon from '@material-ui/icons/Edit';

export default ({ editMode, onEditBtnClick, onEditDone }) => (
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
      onClick={onEditBtnClick}
    />
  )
);
