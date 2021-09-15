import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePreferencesContext } from '../../../stores/preferences_store';

const PAINTING = 'painting';

const baseStyle = {
  borderRadius: '4px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
  marginRight: '10rem',
};

const Canvas = ({
  image,
  canvasRef,
  tags,
  setTag,
  focusTag,
}) => {
  let prePoint = {};
  const { getLabelByID, getFocusedLabel } = usePreferencesContext();

  const getMaxTagNumber = () => {
    let counter = 1;
    tags.forEach((tag) => {
      if (getFocusedLabel().key === tag.labelID && tag.title) {
        let tagTitleNum = tag.title
          .match(/\([0-9]+\)/i)[0]
          .match(/[0-9]+/i)[0];

        tagTitleNum = Number(tagTitleNum);

        if (tagTitleNum + 1 > counter) {
          counter = tagTitleNum + 1;
        }
      }
    });

    return counter;
  };

  const createTag = () => ({
    key: uuidv4(),
    title: `${getFocusedLabel().title}(${getMaxTagNumber()})`,
    type: PAINTING,
    points: [],
    labelID: getFocusedLabel().key,
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

        if (getFocusedLabel()) {
          paint(
            prePoint,
            currentPoint,
            getFocusedLabel().color,
          );
        }

        prePoint = currentPoint;
      }
      newTag.points.push(prePoint);
    };

    canvasDOM.onmouseup = () => {
      // remove mouse move event
      if (newTag.points.length > 0) {
        setTag([...tags, newTag]);
      }

      canvasDOM.onmousemove = null;
      canvasDOM.onmouseup = null;
    };
  };

  const drawTags = (paintedTags) => {
    const fitTag = (tag) => {
      if (tag.key) {
        return tag.key === focusTag.key;
      }

      return tag.points[0].left === focusTag.points[0].left
        && tag.points[0].top === focusTag.points[0].top;
    };

    if (paintedTags.length !== 0) {
      paintedTags.forEach((tag) => {
        if (
          getLabelByID(tag.labelID)
          && tag.type === PAINTING
          && Array.isArray(tag.points)
        ) {
          const defineColor = focusTag === null || fitTag(tag)
            ? getLabelByID(tag.labelID).color
            : '#999999';

          for (let i = 0; i < tag.points.length - 1; i += 1) {
            paint(
              tag.points[i],
              tag.points[i + 1],
              defineColor,
            );
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
      console.log('render');
    }
  }, [tags, image, focusTag]);

  return image ? (
    <canvas
      ref={canvasRef}
      width={image.width}
      height={image.height}
      style={
        image.width < image.height + 50
          ? { ...baseStyle, height: '100%' }
          : { ...baseStyle, width: 'calc(100% - 11rem)' }
      }
      onMouseDown={drawNewTag}
    />
  ) : null;
};

export default Canvas;
