import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Tooltip from '@material-ui/core/Tooltip';
import getFilter from '../filters/getFilter';
import {
  TAGGED_IMAGE,
  WORKING_FOLDER,
} from '../filters/constants';

import ContextStore from '../context_store';

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

const ExpandIcon = ({
  sidebarExpand,
  setSidebarExpand,
  maxLength,
}) => {
  if ((maxLength > 25 && sidebarExpand) || (maxLength < 25 && !sidebarExpand)) {
    return (
      <ChevronLeftIcon
        fontSize="inherit"
        onClick={() => setSidebarExpand(!sidebarExpand)}
      />
    );
  }

  return (
    <ChevronRightIcon
      fontSize="inherit"
      onClick={() => setSidebarExpand(!sidebarExpand)}
    />
  );
};

const SideBar = ({ pages }) => {
  const history = useHistory();
  const [sidebarExpand, setSidebarExpand] = useState(false);
  const {
    removePage,
    workingPath,
    filterList,
    setFilterList,
  } = useContext(ContextStore);
  let maxLength = 0;

  const handleClick = (e, page) => {
    if (e.target.className.indexOf('icon-cancel-circled') !== -1) {
      removePage(page);
    } else if (history.location.pathname !== page.key) {
      history.push(page.key);
    }
  };

  const filterPage = () => {
    if (pages.length > 0) {
      const filteredMedia = filterList.reduce((list, filter) => (
        getFilter(filter.name, list, filter.options)
      ), pages);

      for (let i = 0; i < filteredMedia.length; i += 1) {
        if (filteredMedia[i].name.length > maxLength) {
          maxLength = filteredMedia[i].name.length;
        }
      }

      return filteredMedia;
    }

    return null;
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

  useEffect(() => {
    const updateWorkingPath = () => {
      filterList.splice(
        findFilter(WORKING_FOLDER),
        1,
        {
          name: WORKING_FOLDER,
          options: { workingPath },
        },
      );
      setFilterList([...filterList]);
    };

    updateWorkingPath();
  }, [workingPath]);

  return (
    <div
      className={`${sidebarExpand === true ? '' : 'pane-sm '}sidebar`}
      style={{
        overflowY: 'scroll',
        maxWidth: maxLength < 25 ? '170px' : '',
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
          <IconButton
            aria-label="expand"
            size="small"
          >
            <ExpandIcon
              sidebarExpand={sidebarExpand}
              setSidebarExpand={setSidebarExpand}
              maxLength={maxLength}
            />
          </IconButton>
        </div>
      </div>
      <ul className="list-group">
        {
          imageList !== null ? imageList.map((page) => (
            <SideBarItem
              page={page}
              handleClick={handleClick}
              focusTabName={history.location.pathname}
              maxLength={maxLength}
            />
          )) : null
        }
      </ul>
    </div>
  );
};

export default SideBar;
