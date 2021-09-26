import React from 'react';
import EditLabe from './edit_label';
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

  return (
    <>
      <CreateLabel />
      {
        labels.length !== 0 && getFocusedLabel() !== null ? labels
          .map((label) => (
            <div
              key={label.key}
              style={labelStyle}
            >
              <EditLabe label={label} />
            </div>
          )) : null
      }
    </>
  );
};
