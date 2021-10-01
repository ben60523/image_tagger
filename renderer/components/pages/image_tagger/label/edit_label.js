import React, { useState } from 'react';
import ColorIcon from '../../../common-components/color_icon';
import EditCard from './edit_card';

import { usePreferencesContext } from '../../../../stores/preferences_store';

export default function EditModeLabel({ label }) {
  const { updateLabel } = usePreferencesContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onEditDone = (title, color) => {
    updateLabel({
      ...label,
      title,
      color,
    });
    setAnchorEl(null);
  };

  return (
    <>
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
        <ColorIcon color={label.color} />
        {label.title}
      </div>
      <EditCard
        label={label}
        anchorEl={anchorEl}
        onEditDone={onEditDone}
        handleClick={handleClick}
      />
    </>
  );
}
