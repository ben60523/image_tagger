import {
  GET_TAGS_FROM_DB,
  DELETE_TAG,
  ADD_TAG,
  HIDE_TAG,
  SHOW_TAG,
} from './constants';

import { removeFromList, hideTag, showTag } from './utils';

const onAddTag = (tagList, newTag) => {
  const tagIndex = tagList.findIndex((tag) => (
    tag.label === newTag.label
    && tag.width === newTag.width
    && tag.height === newTag.height
    && tag.left === newTag.left
    && tag.top === newTag.top
  ));

  if (tagIndex === -1) {
    return [...tagList, newTag];
  }

  return tagList;
};

export default (state, [type, payload]) => {
  switch (type) {
    case GET_TAGS_FROM_DB:
      return payload;
    case DELETE_TAG:
      return removeFromList(payload, state);
    case ADD_TAG:
      return onAddTag(state, payload);
    case HIDE_TAG:
      return hideTag(payload, state);
    case SHOW_TAG:
      return showTag(payload, state);
    default:
      return state;
  }
};
