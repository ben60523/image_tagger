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

const baseStyle = {
  borderRadius: '4px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
  marginRight: '5px',
};

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 27px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
};

const PAINTING = 'painting';

const Canvas = ({
  image,
  getFocusLabel,
  canvasRef,
  tags,
  setTag,
  getLabelByID,
}) => {
  let prePoint = {};

  const createTag = () => ({
    type: PAINTING,
    points: [],
    labelID: getFocusLabel().key,
  });

  const paint = (prevPos, currPos, color) => {
    const { left, top } = currPos;
    const { left: x, top: y } = prevPos;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.lineWidth = context.canvas.width > context.canvas.height
      ? Math.round(context.canvas.width / 500)
      : Math.round(context.canvas.height / 500);

    context.beginPath();

    context.strokeStyle = color;
    // Move the the prevPosition of the mouse
    context.moveTo(x, y);
    // Draw a line to the current position of the mouse
    context.lineTo(left, top);
    // Visualize the line using the strokeStyle
    context.stroke();
  };

  const drawNewTag = () => {
    prePoint = null;

    const newTag = createTag();

    // Add mouse move event
    const canvasDOM = canvasRef.current;
    const context = canvasDOM.getContext('2d');

    const scaleX = canvasDOM.width / context.canvas.offsetWidth;
    const scaleY = canvasDOM.height / context.canvas.offsetHeight;

    canvasDOM.onmousemove = (event) => {
      if (prePoint == null) {
        prePoint = {
          left: Math.round(event.offsetX * scaleX),
          top: Math.round(event.offsetY * scaleY),
        };
      } else {
        const currentPoint = {
          left: Math.round(event.offsetX * scaleX),
          top: Math.round(event.offsetY * scaleY),
        };

        if (getFocusLabel()) {
          paint(
            prePoint,
            currentPoint,
            getFocusLabel().color,
          );
        }

        prePoint = currentPoint;
      }
      newTag.points.push(prePoint);
    };

    canvasDOM.onmouseup = () => {
      // remove mouse move event
      setTag([...tags, newTag]);
      canvasDOM.onmousemove = null;
      canvasDOM.onmouseup = null;
    };
  };

  const drawTags = (paintedTags) => {
    if (paintedTags.length !== 0) {
      paintedTags.forEach((tag) => {
        if (getLabelByID(tag.labelID)) {
          const { color } = getLabelByID(tag.labelID);
          if (tag.type === PAINTING && Array.isArray(tag.points)) {
            for (let i = 0; i < tag.points.length - 1; i += 1) {
              paint(tag.points[i], tag.points[i + 1], color);
            }
          }
        }
      });
    }
  };

  const initDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    context.drawImage(image, 0, 0, width, height);
    drawTags(tags);
  };

  useEffect(() => {
    if (image) {
      initDraw();
    }
  }, [tags, image]);

  return image ? (
    <canvas
      ref={canvasRef}
      width={image.width}
      height={image.height}
      style={
        image.width < image.height + 50
          ? { ...baseStyle, height: '100%' }
          : { ...baseStyle, width: 'calc(100% - 11em)' }
      }
      onMouseDown={drawNewTag}
    />
  ) : null;
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
