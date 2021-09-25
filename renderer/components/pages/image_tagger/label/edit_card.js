import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Palette from '../../../common-components/palette';

export default function EditCard({
  label,
  anchorEl,
  onEditDone,
  handleClick,
}) {
  const [labelInput, setLabelInput] = useState(label.title);
  const [selectedColor, setSelectedColor] = useState(label.color);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
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
            <Button
              size="small"
              onClick={() => onEditDone(labelInput, selectedColor)}
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </ClickAwayListener>
    </Popper>
  );
}
