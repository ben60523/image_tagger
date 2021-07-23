import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';

const usePrevOpen = (open) => {
  const prevOpen = React.useRef();

  React.useEffect(() => {
    prevOpen.current = open;
  });

  return prevOpen.current;
};

const TagItem = ({ tag, removeTag, getLabelByID }) => {
  const { key } = tag;
  const label = getLabelByID(tag.labelID);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const prevOpen = usePrevOpen(open);

  const handleToggle = () => {
    setOpen(!prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const onDeleteClick = (e) => {
    removeTag(tag);
    handleClose(e);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        key={key}
        onClick={handleToggle}
        size="small"
        style={{
          padding: '3px 10px',
          width: '100%',
          fontSize: '13px',
          textTransform: 'none',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <span
          className="icon icon-record"
          style={{ color: label.color, marginRight: '5px' }}
        />
        {label.title}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="left-start"
        role={undefined}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id="simple-menu"
                  autoFocusItem={open}
                >
                  <MenuItem
                    style={{
                      fontSize: '13px',
                    }}
                    onClick={(e) => onDeleteClick(e, tag)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default ({
  tagList,
  removeTag,
  getLabelByID,
}) => (
  <>
    <h5 className="nav-group-title">
      Tags
    </h5>
    { tagList.map((tag) => (
      <TagItem
        tag={tag}
        removeTag={removeTag}
        getLabelByID={getLabelByID}
      />
    )) }
  </>
);
