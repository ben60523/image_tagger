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

import {
  loadImage,
} from './utils';

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

const Canvas = ({
  image,
  getTag,
  updatePage,
  canvasRef,
}) => {
  let prePoint = {};

  const paint = (prevPos, currPos, color) => {
    const { left, top } = currPos;
    const { left: x, top: y } = prevPos;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scale = () => ({
      scaleX: canvas.width / context.canvas.offsetWidth,
      scaleY: canvas.height / context.canvas.offsetHeight,
    });

    context.lineWidth = context.canvas.width > context.canvas.height
      ? Math.round(context.canvas.width / 500)
      : Math.round(context.canvas.height / 500);

    context.beginPath();

    context.strokeStyle = color;
    // Move the the prevPosition of the mouse
    context.moveTo(x * scale().scaleX, y * scale().scaleY);
    // Draw a line to the current position of the mouse
    context.lineTo(left * scale().scaleX, top * scale().scaleY);
    // Visualize the line using the strokeStyle
    context.stroke();

    prePoint = { left, top };
  };

  const onMouseDown = (e) => {
    prePoint = {
      left: e.offsetX,
      top: e.offsetY,
    };

    // Add mouse move event
    const ref = canvasRef;
    ref.current.onmousemove = (event) => {
      paint(
        prePoint,
        {
          left: event.offsetX,
          top: event.offsetY,
        },
        getTag().color,
      );
    };
  };

  const onMouseUp = () => {
    // remove mouse move event
    const ref = canvasRef;
    ref.current.onmousemove = null;
  };

  const initDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    context.drawImage(image, 0, 0, width, height);
  };

  useEffect(() => {
    if (image) {
      initDraw();
    }

    return () => {
      if (image && canvasRef.current) {
        updatePage(canvasRef.current.toDataURL('image/jpeg', 1.0));
      }
    };
  }, [image]);

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
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUp={(e) => onMouseUp(e)}
    />
  ) : null;
};

export default function imageTagger({ page }) {
  const canvasRef = useRef(null);
  const { labels, onUpdatePage } = useContext(ContextStore);
  const [image, setImage] = useState(null);
  const [tagConfig, setTagConfig] = useState(labels[0]);

  const updatePage = (snapshot) => {
    onUpdatePage({
      ...page,
      snapshot,
    });
  };

  const getTag = () => tagConfig;

  const initImage = () => {
    loadImage(page.src)
      .then((img) => setImage(img))
      .catch((error) => console.log('loading image error', error));
  };

  const takeSnapshot = (e) => {
    const dataURL = canvasRef.current.toDataURL();
    console.log(e.currentTarget);
    e.currentTarget.href = dataURL;
  };

  // Initial content
  useEffect(() => {
    if (page.snapshot) {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = page.snapshot;
    } else {
      initImage();
    }
  }, []);

  return (
    <div
      id="canvas-container"
      style={containerStyle}
    >
      <Canvas
        canvasRef={canvasRef}
        getTag={getTag}
        image={image}
        updatePage={updatePage}
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
              onClick={initImage}
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
        <Labels setTagConfig={setTagConfig} />
      </div>
    </div>
  );
}
