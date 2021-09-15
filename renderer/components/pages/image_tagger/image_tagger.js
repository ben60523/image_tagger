import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Divider from '@material-ui/core/Divider';

import { loadImage } from '../../../utils';

import Labels from './labels';
import Canvas from './canvas';
import Toolbar from './toolbar';
import TagList from './tag_list';
import { usePageContext } from '../../../stores/page_store';

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 27px)',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
};

export default function imageTagger({ page }) {
  const canvasRef = useRef(null);
  const { onUpdatePage } = usePageContext();
  const [image, setImage] = useState(null);
  const [focusTag, setFocusTag] = useState(null);
  const [tags, setTag] = useState(page.tags);

  const updatePageTag = () => {
    onUpdatePage({
      ...page,
      tags,
    });
  };

  const removeAllTags = () => {
    setTag([]);
  };

  const removeTag = (tag) => {
    const tagIndex = tags.findIndex((currentTag) => currentTag.key === tag.key);

    tags.splice(tagIndex, 1);
    setTag([...tags]);
  };

  const takeSnapshot = (e) => {
    const dataURL = canvasRef.current.toDataURL();
    e.currentTarget.href = dataURL;
  };

  // Initial content
  useEffect(() => {
    const initImage = () => {
      loadImage(page.src)
        .then((img) => setImage(img))
        .catch(() => {
          setTimeout(() => {
            initImage();
          }, 500);
        });
    };

    initImage();
  }, []);

  useEffect(() => updatePageTag(tags), [tags]);

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
        style={{
          position: 'absolute',
          right: '0',
          paddingRight: '0.5rem',
          height: '100%',
          maxWidth: '10rem',
          marginRight: '3px',
          overflowY: 'scroll',
        }}
      >
        <div
          style={{
            fontSize: '1.1rem',
            margin: '10px 10px',
            overflow: 'auto',
            textOverflow: 'ellipsis',
          }}
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
