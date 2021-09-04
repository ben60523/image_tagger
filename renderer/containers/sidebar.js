import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import getFilter from '../filters/getFilter';

import { usePage } from '../stores/page_store';
import { TAGGED_IMAGE } from '../constants';

const SideBarItem = ({
  page,
  handleClick,
  focusTabName,
}) => {
  const getTab = () => (
    page.key === focusTabName
      ? 'active'
      : ''
  );

  return (
    <Tooltip title={page.name} placement="right">
      <li className={`list-group-item ${getTab()}`}>
        <div
          className="tab-body"
          role="button"
          onClick={(e) => handleClick(e, page)}
          onKeyDown={() => {}}
          tabIndex={0}
          style={{
            padding: '5px 10px',
            color: page.tags.length > 0 ? '#414142' : '#737475',
          }}
        >
          { page.tags.length > 0 ? <strong>{page.name}</strong> : page.name }
        </div>
      </li>
    </Tooltip>
  );
};

const SideBar = ({
  filterList,
  setFilterList,
}) => {
  const history = useHistory();
  const { pages } = usePage();

  const handleClick = (e, page) => {
    history.push(page.key);
  };

  const filterPage = () => {
    if (Array.isArray(pages) && pages.length > 0) {
      const filteredMedia = filterList.reduce((list, filter) => (
        getFilter(filter.name, list, filter.options)
      ), pages);

      return filteredMedia;
    }

    return [];
  };

  const findFilter = (filterName) => filterList.findIndex(
    (filter) => filter.name === filterName,
  );

  const toggleTagFilter = (filterName) => {
    const filterIndex = findFilter(filterName);

    if (filterIndex === -1) {
      setFilterList(
        [
          ...filterList,
          { name: TAGGED_IMAGE },
        ],
      );
    } else {
      filterList.splice(filterIndex, 1);
      setFilterList([...filterList]);
    }
  };

  const imageList = filterPage();

  return (
    <div
      className="pane-sm sidebar"
      style={{
        overflowY: 'scroll',
        maxWidth: '170px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 10px',
          alignItems: 'center',
          backgroundColor: '#f5f5f4',
        }}
      >
        <div>
          Images
        </div>
        <div>
          <Tooltip
            title="Show tagged images only"
            placement="right"
          >
            <IconButton
              aria-label="expand"
              size="small"
              onClick={() => toggleTagFilter(TAGGED_IMAGE)}
            >
              {
                findFilter(TAGGED_IMAGE) === -1 ? (
                  <BookmarkBorderIcon fontSize="inherit" />
                ) : (
                  <BookmarkIcon fontSize="inherit" />
                )
              }
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <ul className="list-group">
        {
          imageList !== null ? imageList.map((page) => (
            <SideBarItem
              page={page}
              handleClick={handleClick}
              focusTabName={history.location.pathname}
            />
          )) : null
        }
      </ul>
    </div>
  );
};

export default SideBar;
