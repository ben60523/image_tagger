import {
  ADD_PAGE,
  CLOSE_PAGE,
  UPDATE_PAGE,
  IMPORT_PAGE,
} from './constants';

const findPageIndex = (targetPage, pageList) => (
  pageList.findIndex((page) => targetPage.key === page.key)
);

const removePageFromState = (pages, removedPage) => {
  const rmPageIndex = findPageIndex(removedPage, pages);
  pages.splice(rmPageIndex, 1);
  return [...pages];
};

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

  const isSame = () => {
    if (comparedPage.tags.length !== updatedPage.tags.length) {
      return false;
    }

    return true;
  };

  if (pageIndex !== -1 && !isSame(comparedPage, updatedPage)) {
    pages.splice(pageIndex, 1, updatedPage);
    return [...pages];
  }

  return pages;
};

const onImportPage = (prePages, importCtn) => importCtn.reduce(
  (newPageList, importPage) => {
    const index = newPageList.findIndex((prePage) => (
      prePage.src === importPage.src
    ));

    if (index !== -1) {
      return newPageList;
    }

    return [...prePages, importPage];
  },
  prePages,
);

export default (state, action) => {
  switch (action.type) {
    case ADD_PAGE:
      return onAddPage(state, action);
    case UPDATE_PAGE:
      return onUpdate(state, action.payload);
    case CLOSE_PAGE:
      return removePageFromState(state, action.payload);
    case IMPORT_PAGE:
      return onImportPage(state, action.payload);
    default:
      return state;
  }
};
