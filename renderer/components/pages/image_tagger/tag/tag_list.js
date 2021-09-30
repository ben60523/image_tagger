import React from 'react';
import TagItem from './tag_item';

export default React.memo(
  ({
    tagList,
    removeTag,
    setFocusTag,
  }) => (
    <>
      <h5 className="nav-group-title">
        Tags
      </h5>
      { tagList.map((tag) => (
        <TagItem
          tag={tag}
          removeTag={removeTag}
          setFocusTag={setFocusTag}
        />
      )) }
    </>
  ),
);
