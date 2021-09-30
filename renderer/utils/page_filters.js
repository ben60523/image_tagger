const filterTaggedPage = (page) => page.tags.length > 0;

const searchFromName = (page, options) => (page.name.search(options.regexp) !== -1);

export default {
  filterTaggedPage,
  searchFromName,
};
