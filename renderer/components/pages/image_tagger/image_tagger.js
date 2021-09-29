import React, {
  useRef,
} from 'react';

import Divider from '@material-ui/core/Divider';

import Labels from './label/label_container';
import Canvas from './canvas';
import Toolbar from './toolbar';
import TagList from './tag/tag_list';

import usePage from './page_hook';

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 27px)',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
};

const rightSidebarStyle = {
  position: 'absolute',
  right: '0',
  paddingRight: '0.5rem',
  height: '100%',
  maxWidth: '10rem',
  marginRight: '3px',
  overflowY: 'scroll',
};

const pageTitleStyle = {
  fontSize: '1.1rem',
  margin: '10px 10px',
  overflow: 'auto',
  textOverflow: 'ellipsis',
};

export default function imageTagger({ page }) {
  const canvasRef = useRef(null);
  const {
    image,
    focusTag,
    tags,
    removeAllTags,
    removeTag,
    setTag,
    setFocusTag,
  } = usePage({ page });

  const takeSnapshot = (e) => {
    const dataURL = canvasRef.current.toDataURL();
    e.currentTarget.href = dataURL;
  };

  if (!page) return null;

  return (
    <div
      id="canvas-container"
      style={containerStyle}
    >
      <Canvas
        canvasRef={canvasRef}
        image={image}
        setTag={setTag}
        tags={tags}
        focusTag={focusTag}
      />
      <div
        style={rightSidebarStyle}
      >
        <div
          style={pageTitleStyle}
        >
          {page.name}
        </div>
        <Divider />
        <Toolbar
          downloadName={page.name.replace(/(.png|.jpg|.jpeg)/i, '')}
          removeAllTags={removeAllTags}
          takeSnapshot={takeSnapshot}
        />
        <Divider />
        <Labels />
        <TagList
          tagList={tags}
          removeTag={removeTag}
          setFocusTag={setFocusTag}
        />
      </div>
    </div>
  );
}
