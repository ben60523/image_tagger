import { TAGGED_IMAGE } from '../constants';

const filterTaggedImg = (pageList) => (
  pageList.filter((page) => page.tags.length > 0)
);

export default (filterName, list) => {
  switch (filterName) {
    case TAGGED_IMAGE:
      return filterTaggedImg(list);
    default:
      return list;
  }
};
