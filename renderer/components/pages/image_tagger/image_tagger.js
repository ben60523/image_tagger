import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';

import Divider from '@material-ui/core/Divider';

import ContextStore from '../../../context_store';

import { loadImage } from '../../../utils';

import Labels from './labels';
import Canvas from './canvas';
import Toolbar from './toolbar';
import TagList from './tag_list';

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
  const { labels, onUpdatePage } = useContext(ContextStore);
  const [image, setImage] = useState(null);
  const [focusTag, setFocusTag] = useState(null);
  const [tags, setTag] = useState(page.tags);
  const [taggedLabel, setTaggedLabel] = useState(labels[0]);

  const updatePageTag = () => {
    onUpdatePage({
      ...page,
      tags,
    });
  };

  const getLabelByID = (id) => labels.find((label) => label.key === id);

  const getFocusLabel = () => taggedLabel;

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
    console.log(e.currentTarget);
    e.currentTarget.href = dataURL;
  };

  // Initial content
  useEffect(() => {
    const initImage = () => {
      loadImage(page.src)
        .then((img) => setImage(img))
        .catch((error) => {
          console.log('loading image error', error);

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
        getFocusLabel={getFocusLabel}
        image={image}
        setTag={setTag}
        tags={tags}
        getLabelByID={getLabelByID}
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
        <Labels setTaggedLabel={setTaggedLabel} />
        <TagList
          tagList={tags}
          getLabelByID={getLabelByID}
          removeTag={removeTag}
          setFocusTag={setFocusTag}
        />
      </div>
    </div>
  );
}
