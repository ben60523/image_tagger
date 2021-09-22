import React from 'react';

import { usePreferencesContext } from '../../../stores/preferences_store';

const labelStyle = {
  position: 'relative',
  display: 'flex',
  padding: '3px 10px',
  borderRadius: '5px',
  marginTop: '5px',
  alignItems: 'center',
};

export default () => {
  const { labels, onSetFocusedLabelID, getFocusedLabel } = usePreferencesContext();

  return (
    <div>
      <h5 className="nav-group-title">
        Labels
      </h5>
      {
        labels.length !== 0 && getFocusedLabel() !== null ? labels
          .map((label) => (
            <div
              key={label.key}
              role="button"
              style={labelStyle}
              onClick={() => onSetFocusedLabelID(label.key)}
              onKeyDown={() => null}
              tabIndex={0}
            >
              <span
                className={`icon ${getFocusedLabel().key !== label.key ? 'icon-record' : 'icon-play'}`}
                style={{ color: label.color, marginRight: '5px' }}
              />
              {label.title}
            </div>
          )) : null
      }
    </div>
  );
};
