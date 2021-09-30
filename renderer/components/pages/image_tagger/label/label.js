import React from 'react';

import { usePreferencesContext } from '../../../../stores/preferences_store';

export default ({ label }) => {
  const { onSetFocusedLabelID, getFocusedLabel } = usePreferencesContext();

  if (!label) {
    return null;
  }

  return (
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
        className={`icon ${getFocusedLabel()?.key !== label.key ? 'icon-record' : 'icon-play'}`}
        style={{ color: label.color, marginRight: '5px' }}
      />
      {label.title}
    </div>
  );
};
