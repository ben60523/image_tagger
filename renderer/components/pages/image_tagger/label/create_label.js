import React, { useState } from 'react';
import EditCard from './edit_card';

import { usePreferencesContext } from '../../../../stores/preferences_store';

const label = {
  title: 'default',
  color: '#64b5f6',
};

export default function CreateModeLabel() {
  const { createLabel } = usePreferencesContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onEditDone = (title, color) => {
    createLabel({
      title,
      color,
    });
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        padding: '3px 10px',
        borderRadius: '5px',
        marginTop: '5px',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#666666',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        role="button"
        onClick={handleClick}
        onKeyDown={() => null}
        tabIndex={0}
      >
        +  New Label
      </div>
      <EditCard
        label={label}
        anchorEl={anchorEl}
        onEditDone={onEditDone}
        handleClick={handleClick}
      />
    </div>
  );
}
