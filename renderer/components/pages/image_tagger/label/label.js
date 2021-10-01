import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ColorIcon from '../../../common-components/color_icon';

import { usePreferencesContext } from '../../../../stores/preferences_store';

const iconStyle = (color) => ({
  fontSize: '14px',
  color,
  marginRight: '5px',
});

export default ({ label }) => {
  const { onSetFocusedLabelID, getFocusedLabel } = usePreferencesContext();

  if (!label) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      role="button"
      onClick={() => onSetFocusedLabelID(label.key)}
      onKeyDown={() => null}
      tabIndex={0}
    >
      {
        getFocusedLabel()?.key === label.key ? (
          <CheckIcon
            style={iconStyle(label.color)}
          />
        ) : (
          <ColorIcon color={label.color} />
        )
      }
      {label.title}
    </div>
  );
};
