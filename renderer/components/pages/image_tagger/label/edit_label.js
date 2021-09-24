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
    '#64b5f6', // light blue
    '#2196f3', // main blue
    '#1976d2', // dark blue
    '#e57373', // light red
    '#f44336', // main red
    '#d32f2f', // dark red
    '#ffb74d', // light yellow
    '#ff9800', // main yellow
    '#f57c00', // dark yellow
    '#81c784', // light green
    '#4caf50', // main green
    '#388e3c', // dark green
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
          selectedColor === color ? (
            <CheckCircleIcon
              style={{
                color,
                margin: '2px',
              }}
            />
          ) : (
            <FiberManualRecordIcon
              style={{
                color,
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
  const { updateLabel } = usePreferencesContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelInput, setLabelInput] = useState(label.title);
  const [selectedColor, setSelectedColor] = useState(label.color);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onEditDone = () => {
    updateLabel({
      ...label,
      title: labelInput,
      color: selectedColor,
    });
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
