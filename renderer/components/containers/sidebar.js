import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

import { usePageContext } from '../../stores/page_store';
import { FILTER_TAGGED_PAGE } from '../../constants';

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

const SideBar = () => {
  const history = useHistory();
  const { pages, toggleTagFilter, findFilter } = usePageContext();

  const handleClick = (e, page) => {
    history.push(page.key);
  };

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
              onClick={() => toggleTagFilter()}
            >
              {
                findFilter(FILTER_TAGGED_PAGE) === -1 ? (
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
          pages.map((page) => (
            <SideBarItem
              page={page}
              handleClick={handleClick}
              focusTabName={history.location.pathname}
            />
          ))
        }
      </ul>
    </div>
  );
};

export default SideBar;
