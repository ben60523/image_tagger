import {
  UPDATE_PAGE,
  IMPORT_PAGE,
} from '../constants';

const findPageIndex = (targetPage, pageList) => (
  pageList.findIndex((page) => targetPage.key === page.key)
);

const onUpdate = (pages, updatedPage) => {
  const pageIndex = findPageIndex(updatedPage, pages);
  const comparedPage = pages[pageIndex];

  // Page contents is wrong
  if (!Array.isArray(comparedPage.tags) || !Array.isArray(updatedPage.tags)) {
    return pages;
  }

  if (pageIndex !== -1) {
    pages.splice(pageIndex, 1, updatedPage);
    return [...pages];
  }

  return pages;
};

export default (state, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return onUpdate(state, action.payload);
    case IMPORT_PAGE:
      return [...action.payload];
    default:
      return state;
  }
};
