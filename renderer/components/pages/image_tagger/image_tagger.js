import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';

import Divider from '@material-ui/core/Divider';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CameraIcon from '@material-ui/icons/Camera';

import ContextStore from '../../../context_store';

import { loadImage } from '../../../utils';

import Labels from './labels';
import Canvas from './canvas';

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 27px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
};

export default function imageTagger({ page }) {
  const canvasRef = useRef(null);
  const { labels, onUpdatePage } = useContext(ContextStore);
  const [image, setImage] = useState(null);
  const [tags, setTag] = useState(page.tags);
  const [teggedLabel, setTaggedLabel] = useState(labels[0]);

  const updatePageTag = () => {
    onUpdatePage({
      ...page,
      tags,
    });
  };

  const getLabelByID = (id) => labels.find((label) => label.key === id);

  const getFocusLabel = () => teggedLabel;

  const removeAllTags = () => {
    setTag([]);
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
        .catch((error) => console.log('loading image error', error));
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
      />
      <div
        style={{
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
              download={`${page.name}_snapshot.png`}
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
        <Divider />
        <Labels setTaggedLabel={setTaggedLabel} />
      </div>
    </div>
  );
}
