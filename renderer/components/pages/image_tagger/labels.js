import React, { useState, useEffect, useContext } from 'react';

import ContextStore from '../../../context_store';

export default ({ setTaggedLabel }) => {
  const { labels } = useContext(ContextStore);
  const [focusedLabel, setFocusLabel] = useState(labels[0]);

  const updateCurrentLabel = (selectedLabel) => {
    setFocusLabel(selectedLabel);
  };

  useEffect(() => {
    if (labels.length !== 0) {
      setFocusLabel(labels[0]);
    }
  }, []);

  useEffect(() => {
    setTaggedLabel(focusedLabel);
  }, [focusedLabel]);

  return (
    <div>
      <h5 className="nav-group-title">
        Labels
      </h5>
      {
        labels.length !== 0 ? labels
          .sort((a, b) => (a.title > b.title ? 1 : -1))
          .map((label) => (
            <div
              key={label.key}
              role="button"
              style={{
                position: 'relative',
                display: 'flex',
                padding: '3px 10px',
                borderRadius: '5px',
                marginTop: '5px',
                alignItems: 'center',
              }}
              onClick={() => updateCurrentLabel(label)}
              onKeyDown={() => console.log('key down')}
              tabIndex={0}
            >
              <span
                className={`icon ${focusedLabel.key !== label.key ? 'icon-record' : 'icon-play'}`}
                style={{ color: label.color, marginRight: '5px' }}
              />
              {label.title}
            </div>
          )) : null
      }
    </div>
  );
};
