import React from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const iconStyle = (color) => ({
  fontSize: '14px',
  color,
  marginRight: '5px',
});

const ColorIcon = ({ color }) => (
  <FiberManualRecordIcon
    style={iconStyle(color)}
  />
);

export default ColorIcon;
