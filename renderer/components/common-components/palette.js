import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export default function Palette({ selectedColor, handleColorChange }) {
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
