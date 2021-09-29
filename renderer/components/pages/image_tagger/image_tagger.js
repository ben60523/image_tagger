import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import Divider from '@material-ui/core/Divider';

import { loadImage } from '../../../utils/files_handler';

import Labels from './label/label_container';
import Canvas from './canvas';
import Toolbar from './toolbar';
import TagList from './tag/tag_list';
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

const usePage = ({ page }) => {
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

  const removeTag = useCallback(
    (tag) => {
      const tagIndex = tags.findIndex((currentTag) => currentTag.key === tag.key);

      tags.splice(tagIndex, 1);
      setTag([...tags]);
    },
    [tags],
  );

  const initImage = () => {
    loadImage(page.src)
      .then((img) => setImage(img))
      .catch(() => {
        setTimeout(() => {
          initImage();
        }, 500);
      });
  };

  // Initial content
  useEffect(() => {
    initImage();
  }, []);

  useEffect(() => updatePageTag(tags), [tags]);

  return {
    image,
    focusTag,
    tags,
    removeAllTags,
    removeTag,
    setTag,
    setFocusTag,
  };
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
