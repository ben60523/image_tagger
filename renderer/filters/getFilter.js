import {
  WORKING_FOLDER,
  TAGGED_IMAGE,
  PARTICULAR,
} from '../constants';

const filterWorkingPath = (pageList, workingPath = '') => (
  pageList.filter((page) => page.src.indexOf(workingPath) !== -1)
);

const filterTaggedImg = (pageList) => (
  pageList.filter((page) => page.tags.length > 0)
);

const filterList = (perPagelist, pageList) => {
  const newList = perPagelist.filter((perPage) => {
    const index = pageList.findIndex((page) => page.key === perPage.key);

    if (index !== -1) {
      return true;
    }

    return false;
  });

  return newList;
};

export default (filterName, list, options) => {
  switch (filterName) {
    case WORKING_FOLDER:
      return filterWorkingPath(list, options.workingPath);
    case TAGGED_IMAGE:
      return filterTaggedImg(list);
    case PARTICULAR:
      return filterList(list, options.nameList);
    default:
      return list;
  }
};
