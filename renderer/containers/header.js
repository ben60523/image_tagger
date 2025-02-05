import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';

import { importProject } from '../utils';

const Header = ({
  exportProject,
  selectFolder,
  workingPath,
  importPage,
}) => {
  const clickInput = () => {
    const fileElem = document.getElementById('fileElem');

    if (fileElem) {
      fileElem.click();
    }
  };

  const onImportZip = async (e) => importPage(await importProject(e));

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 2%',
        alignItems: 'center',
        backgroundColor: '#f5f5f4',
      }}
    >
      <div>
        <Tooltip title="Import Zip">
          <IconButton
            aria-label="expand"
            size="small"
            onClick={clickInput}
            style={{
              marginRight: '5px',
            }}
          >
            <LibraryAddIcon />
            <input
              type="file"
              id="fileElem"
              name="file"
              onChange={onImportZip}
              style={{ display: 'none' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open Folder">
          <IconButton
            aria-label="expand"
            size="small"
            onClick={() => selectFolder('default')}
            style={{
              marginRight: '5px',
            }}
          >
            <FolderOpenIcon className="icon" />
          </IconButton>
        </Tooltip>
        <strong>{workingPath}</strong>
      </div>
      <Tooltip title="Save">
        <IconButton
          aria-label="expand"
          size="small"
          onClick={exportProject}
        >
          <SaveIcon className="icon" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Header;
