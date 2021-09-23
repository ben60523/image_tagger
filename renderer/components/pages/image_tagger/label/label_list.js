import React, { useState } from 'react';
import Label from './label';

import { usePreferencesContext } from '../../../../stores/preferences_store';

export default () => {
  const { labels, getFocusedLabel } = usePreferencesContext();
  const [editedLbelID, setEditedLbelID] = useState(null);

  return (
    <div>
      <div
        style={{
          padding: '10px 10px 2px',
          fontWeight: '500',
          color: '#666666',
        }}
      >
        Labels
      </div>
      {
        labels.length !== 0 && getFocusedLabel() !== null ? labels
          .map((label) => (
            <Label
              label={label}
              editedLbelID={editedLbelID}
              setEditedLbelID={setEditedLbelID}
            />
          )) : null
      }
    </div>
  );
};
