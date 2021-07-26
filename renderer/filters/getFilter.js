import {
  WORKING_FOLDER,
  TAGGED_IMAGE,
} from '../constants';

const filterWorkingPath = (pageList, workingPath = '') => (
  pageList.filter((page) => page.src.indexOf(workingPath) !== -1)
);

const filterTaggedImg = (pageList) => (
  pageList.filter((page) => page.tags.length > 0)
);

export default (filterName, list, options) => {
  switch (filterName) {
    case WORKING_FOLDER:
      return filterWorkingPath(list, options.workingPath);
    case TAGGED_IMAGE:
      return filterTaggedImg(list);
    default:
      return list;
  }
};
