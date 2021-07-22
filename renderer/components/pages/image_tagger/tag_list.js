import React from 'react';

export default ({
  tagList,
  toggleTags,
  removeTag,
  getLabelByID,
}) => {
  // const [focusedTag, setFocusTag] = useState(null);

  const onTagPressed = (e, tag) => {
    if (e.target.className.includes('trash')) removeTag(tag);
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
        tagList.map((tag) => {
          const { key } = tag;
          const label = getLabelByID(tag.labelID);

          return (
            <div
              className="list-group-item"
              role="button"
              key={key}
              style={{
                position: 'relative',
                padding: '5px 10px',
                border: '1px solid #888',
                borderRadius: '3px',
                marginTop: '5px',
                display: 'flex',
                boxSizing: 'border-box',
                maxWidth: '9rem',
              }}
              tabIndex={0}
              onMouseDown={(e) => onTagPressed(e, tag)}
              // onMouseEnter={() => setFocusTag(tag)}
              // onMouseLeave={() => setFocusTag(null)}
              onClick={(e) => handleClick(e, tag)}
              onKeyDown={() => (null)}
            >
              <span
                className="icon icon-record"
                style={{ color: label.color, marginRight: '5px' }}
              />
              {label.title}
            </div>
          );
        })
      }
    </>
  );
};
