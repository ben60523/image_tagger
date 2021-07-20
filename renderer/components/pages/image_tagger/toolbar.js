import React from 'react';

import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CameraIcon from '@material-ui/icons/Camera';

const ToolBar = ({ downloadName, removeAllTags, takeSnapshot }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Tooltip title="Refresh">
      <IconButton
        size="small"
        style={{
          color: 'rgba(0, 0, 0, 0.65)',
        }}
        onClick={removeAllTags}
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Snapshot">
      <a
        href="test"
        download={`${downloadName}_snapshot.png`}
        onClick={takeSnapshot}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CameraIcon
          size="small"
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 0, 0, 0.65)',
          }}
        >
          <RefreshIcon />
        </CameraIcon>
      </a>
    </Tooltip>
  </div>
);

export default ToolBar;
