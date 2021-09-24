import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { usePreferencesContext } from '../../../../stores/preferences_store';

function Palette({ selectedColor, handleColorChange }) {
  const colorList = [
    { title: 'light blue', hex: '#64b5f6' },
    { title: 'main blue', hex: '#2196f3' },
    { title: 'dark blue', hex: '#1976d2' },
    { title: 'light red', hex: '#e57373' },
    { title: 'main red', hex: '#f44336' },
    { title: 'dark red', hex: '#d32f2f' },
    { title: 'light yellow', hex: '#ffb74d' },
    { title: 'main yellow', hex: '#ff9800' },
    { title: 'dark yellow', hex: '#f57c00' },
    { title: 'light green', hex: '#81c784' },
    { title: 'main green', hex: '#4caf50' },
    { title: 'dark green', hex: '#388e3c' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexFlow: 'row wrap',
        marginTop: '10px',
      }}
    >
      {
        colorList.map((color) => (
          selectedColor.title === color.title ? (
            <CheckCircleIcon
              style={{
                color: color.hex,
                margin: '2px',
              }}
            />
          ) : (
            <FiberManualRecordIcon
              style={{
                color: color.hex,
                margin: '2px',
              }}
              onClick={() => handleColorChange(color)}
            />
          )
        ))
      }
    </div>
  );
}

export default function EditModeLabel({ label }) {
  const { updateLabelTitle } = usePreferencesContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelInput, setLabelInput] = useState(label.title);
  const [selectedColor, setSelectedColor] = useState({
    title: label.title,
    hex: label.color,
  });

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onEditDone = () => {
    updateLabelTitle(label, labelInput);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

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
          <Card
            style={{
              maxWidth: '10rem',
            }}
          >
            <CardContent>
              <TextField
                label="Title"
                size="small"
                value={labelInput}
                variant="outlined"
                onChange={(e) => setLabelInput(e.target.value)}
              />
              <Palette
                selectedColor={selectedColor}
                handleColorChange={handleColorChange}
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
