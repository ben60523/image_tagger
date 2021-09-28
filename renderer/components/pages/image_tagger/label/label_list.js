import React from 'react';
import Label from './label';
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

export default React.memo(() => {
  const { labels, getFocusedLabel } = usePreferencesContext();

  return labels.length !== 0 && getFocusedLabel() !== null ? labels
    .map((label) => (
      <div
        key={label.key}
        style={labelStyle}
      >
        <Label label={label} />
      </div>
    )) : null;
});
