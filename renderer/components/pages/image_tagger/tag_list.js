import React, { useState } from 'react';

import EditBar from './edit_bar';

export default ({
  tagList,
  toggleTags,
  removeTag,
}) => {
  const [focusedTag, setFocusTag] = useState(null);

  const onTagPressed = (e, tag) => {
    if (e.target.className.includes('trash')) removeTag(tag);
  };

  const getEditBar = (tag) => {
    if (focusedTag && focusedTag.key === tag.key) {
      return <EditBar name="trash" />;
    }

    return null;
  };

  const handleClick = (e, tag) => {
    toggleTags(tag);
  };

  return (
    <>
      <h5 className="nav-group-title">
        Tags
      </h5>
      {
        tagList !== null ? tagList.map((tag) => {
          const { label, key } = tag;

          return (
            <div
              className="list-group-item"
              role="button"
              key={key}
              style={{
                position: 'relative',
                padding: '5px 10px',
                border: `1px solid ${tag.hide ? '#ddd' : '#888'}`,
                borderRadius: '3px',
                marginTop: '5px',
                display: 'flex',
                boxSizing: 'border-box',
              }}
              tabIndex={0}
              onMouseDown={(e) => onTagPressed(e, tag)}
              onMouseEnter={() => setFocusTag(tag)}
              onMouseLeave={() => setFocusTag(null)}
              onClick={(e) => handleClick(e, tag)}
              onKeyDown={() => (null)}
            >
              <span
                className="icon icon-record"
                style={{ color: label.color, marginRight: '5px' }}
              />
              <strong>{label.name}</strong>
              {getEditBar(tag)}
            </div>
          );
        }) : null
      }
    </>
  );
};
