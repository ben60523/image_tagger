import {
  ADD_PAGE,
  UPDATE_PAGE,
  IMPORT_PAGE,
} from '../constants';

const findPageIndex = (targetPage, pageList) => (
  pageList.findIndex((page) => targetPage.key === page.key)
);

const onAddPage = (state, action) => {
  const pageIndex = (targetPage, pageList) => (
    pageList.findIndex((page) => targetPage.src === page.src)
  );

  if (pageIndex(action.payload, state) !== -1) {
    return state;
  }
  return [...state, action.payload];
};

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
    case ADD_PAGE:
      return onAddPage(state, action);
    case UPDATE_PAGE:
      return onUpdate(state, action.payload);
    case IMPORT_PAGE:
      return [...action.payload];
    default:
      return state;
  }
};
