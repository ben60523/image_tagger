import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default ({
  tagList,
  removeTag,
  getLabelByID,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDeleteClick = (tag) => {
    removeTag(tag);
    handleClose();
  };

  return (
    <>
      <h5 className="nav-group-title">
        Tags
      </h5>
      {
        tagList.map((tag) => {
          const { key } = tag;
          const label = getLabelByID(tag.labelID);

          return (
            <>
              <div
                className="list-group-item"
                role="button"
                key={key}
                style={{
                  position: 'relative',
                  padding: '5px 10px',
                  border: '1px solid #888',
                  borderRadius: '3px',
                  marginTop: '5px',
                  display: 'flex',
                  boxSizing: 'border-box',
                  maxWidth: '9rem',
                }}
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={() => (null)}
              >
                <span
                  className="icon icon-record"
                  style={{ color: label.color, marginRight: '5px' }}
                />
                {label.title}
              </div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  style={{
                    fontSize: '13px',
                  }}
                  onClick={() => onDeleteClick(tag)}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          );
        })
      }
    </>
  );
};
