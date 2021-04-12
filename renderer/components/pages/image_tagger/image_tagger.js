import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  useCallback,
  useContext,
} from 'react';

import { useHistory } from 'react-router-dom';
import CameraIcon from '@material-ui/icons/Camera';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import ContextStore from '../../../context_store';

import {
  DELETE_TAG,
  SHOW_TAG,
  HIDE_TAG,
} from './constants';

import {
  loadImage,
  drawTagRectangle,
  drawPreviewingRectangle,
  drawInstructions,
} from './utils';

import tagListReducer from './tag_reducer';

import Labels from './labels';
import TagList from './tag_list';

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

const initialPoint = { left: -1, top: -1 };

export default function imageTagger({ page }) {
  const { onUpdatePage, labels } = useContext(ContextStore);
  const canvasRef = useRef(null);
  const routeHistory = useHistory();
  const [snapshot, setSnapshot] = useState(null);
  const [tagConfig, setTagConfig] = useState({});
  const [tagList, dispatch] = useReducer(tagListReducer, page.tags);
  const [content, setContent] = useState(<div>loading</div>);
  const [mouseDownPoint, setMouseDownPoint] = useState(initialPoint);
  const [currentMousePoint, setCurrentMousePoint] = useState(initialPoint);
  const [mouseUpPoint, setMouseUpPoint] = useState(initialPoint);
  const dpi = window.devicePixelRatio;

  const drawTags = (tags) => {
    if (content.type === 'canvas' && snapshot !== null) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      drawInstructions(context, snapshot, tags, labels);
    }
  };

  const toggleTags = (selectedTag) => {
    if (selectedTag.hide) dispatch([SHOW_TAG, selectedTag]);
    else dispatch([HIDE_TAG, selectedTag]);
  };

  const removeTag = (selectedTag) => {
    dispatch([DELETE_TAG, selectedTag]);
  };

  const takeScreenShot = (e) => {
    const dataURL = canvasRef.current.toDataURL();

    console.log(e.currentTarget);
    e.currentTarget.href = dataURL;
  };

  // Initial content
  useEffect(() => {
    const onMouseDown = (e) => {
      setMouseUpPoint(initialPoint);
      setMouseDownPoint({
        left: e.nativeEvent.offsetX,
        top: e.nativeEvent.offsetY,
      });

      // Add mouse move event
      canvasRef.current.onmousemove = (event) => {
        setCurrentMousePoint({
          left: event.offsetX,
          top: event.offsetY,
        });
      };
    };

    const onMouseUp = (e) => {
      setMouseUpPoint({
        left: e.nativeEvent.offsetX,
        top: e.nativeEvent.offsetY,
      });

      // remove mouse move event
      canvasRef.current.onmousemove = null;
      setCurrentMousePoint(initialPoint);
    };

    const createCanvas = (width, height) => (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={
          width < height + 50
            ? { ...baseStyle, height: '100%' }
            : { ...baseStyle, width: 'calc(100% - 11em)' }
        }
        onMouseDown={(e) => onMouseDown(e)}
        onMouseUp={(e) => onMouseUp(e)}
      />
    );

    const drawImage = () => loadImage(page.src)
      .then((img) => {
        setContent(
          createCanvas(
            img.naturalWidth * dpi,
            img.naturalHeight * dpi,
          ),
        );

        const initDraw = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          const width = img.naturalWidth * dpi;
          const height = img.naturalHeight * dpi;

          context.drawImage(img, 0, 0, width, height);
          setSnapshot(context.getImageData(0, 0, width, height));
        };

        if (canvasRef.current) {
          initDraw();
        } else {
          setTimeout(() => initDraw(), 0);
        }
      })
      .catch((err) => {
        setContent(<div>Loading Media Error</div>);
        console.log(err);
        setTimeout(() => {
          routeHistory.goBack();
        }, 1000);
      });

    drawImage();
  }, []);

  useEffect(() => {
    if (tagList !== null) {
      onUpdatePage({
        ...page,
        tags: tagList,
      });
      drawTags(tagList);
    }
  }, [tagList]);

  useEffect(() => {
    drawTags(tagList);
  }, [snapshot]);

  // handle mouse events
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const scale = () => ({
        scaleX: canvas.width / context.canvas.offsetWidth,
        scaleY: canvas.height / context.canvas.offsetHeight,
      });

      // Check the point isn't in initial state
      const checkPoint = (point) => (point.left !== -1 && point.top !== -1);

      // Check the scope in point1 and point2 isn't a line or a point
      const isArea = (point1, point2) => (
        point1.left !== point2.left && point1.top !== point2.top
      );

      if (checkPoint(mouseDownPoint) && content !== null) {
        if (checkPoint(mouseUpPoint)) {
          // Clean canvas
          drawTags(tagList);
          if (isArea(mouseDownPoint, mouseUpPoint)) {
            drawTagRectangle({
              left: Math.round(mouseDownPoint.left * scale().scaleX),
              top: Math.round(mouseDownPoint.top * scale().scaleY),
              width: Math.round((mouseUpPoint.left - mouseDownPoint.left) * scale().scaleX),
              height: Math.round((mouseUpPoint.top - mouseDownPoint.top) * scale().scaleY),
              label: tagConfig.key,
            }, dispatch);
          }
        } else if (checkPoint(currentMousePoint)) {
          // Clean canvas
          drawTags(tagList);
          drawPreviewingRectangle({
            left: mouseDownPoint.left * scale().scaleX,
            top: mouseDownPoint.top * scale().scaleY,
            width: (currentMousePoint.left - mouseDownPoint.left) * scale().scaleX,
            height: (currentMousePoint.top - mouseDownPoint.top) * scale().scaleY,
          }, context);
        }
      }
    }
  }, [mouseDownPoint, mouseUpPoint, currentMousePoint]);

  return (
    <div
      id="canvas-container"
      style={containerStyle}
    >
      { content }
      {
        useCallback(content.type === 'canvas' ? (
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
            <a
              href="test"
              download="screenshot.png"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                margin: '3px 10px',
              }}
              onClick={takeScreenShot}
            >
              <IconButton size="small">
                <CameraIcon
                  style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                  }}
                />
              </IconButton>
            </a>
            <Divider />
            <Labels setTagConfig={setTagConfig} />
            <TagList
              tagList={tagList}
              toggleTags={toggleTags}
              removeTag={removeTag}
            />
          </div>
        ) : null, [tagList, content])
      }
    </div>
  );
}
