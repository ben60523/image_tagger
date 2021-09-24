import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import { usePreferencesContext } from '../../../../stores/preferences_store';

export default function EditModeLabel({ label }) {
  const { updateLabelTitle } = usePreferencesContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelInput, setLabelInput] = useState(label.title);
  // const [selectedColor, setSelectedColor] = useState(label.color);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onEditDone = () => {
    updateLabelTitle(label, labelInput);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  // const handleColorChange = (event) => {
  //   setSelectedColor(event.target.value);
  // };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        role="button"
        onClick={handleClick}
        onKeyDown={() => null}
        tabIndex={0}
      >
        <span
          className="icon icon-record"
          style={{ color: label.color, marginRight: '5px' }}
        />
        {label.title}
      </div>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <ClickAwayListener onClickAway={handleClick}>
          <Card>
            <CardContent>
              <TextField
                label="Title"
                size="small"
                value={labelInput}
                variant="outlined"
                onChange={(e) => setLabelInput(e.target.value)}
              />
            </CardContent>
            <CardActions>
              <Button size="small" onClick={onEditDone}>Save</Button>
            </CardActions>
          </Card>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
