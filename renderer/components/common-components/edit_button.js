import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
    <MoreVertIcon
      style={{
        fontSize: '16px',
      }}
      onClick={onEditBtnClick}
    />
  )
);
