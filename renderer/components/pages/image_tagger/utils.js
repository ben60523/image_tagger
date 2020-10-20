import url from 'url';
import path from 'path';
import { DRAW_RECTANGLE, ADD_TAG } from './constant';

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeoutTimer = setTimeout(() => {
      reject(new Error('loading image time out'));
    }, 1000);

    img.src = url.format({
      pathname: path.resolve(src),
      protocol: 'file:',
      slashes: true,
    });

    img.onload = () => {
      resolve(img);
      clearTimeout(timeoutTimer);
    };
  });
}

export function drawRectangle(props, ctx) {
  const {
    left, top, width, height, color,
  } = props;

  ctx.lineWidth = ctx.canvas.width > ctx.canvas.height
    ? Math.round(ctx.canvas.width / 500)
    : Math.round(ctx.canvas.height / 500);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.rect(left, top, width, height);
  ctx.stroke();
}

export function fillRectangle(props, ctx) {
  const {
    left, top, width, height, color,
  } = props;

  ctx.fillStyle = color;
  ctx.fillRect(left, top, width, height);
}

export const drawPreviewingRectangle = (position, context) => {
  drawRectangle({
    ...position,
    color: 'rgba(179, 179, 179, 1)',
  }, context);

  fillRectangle({
    ...position,
    color: 'rgba(179, 179, 179, 0.3)',
  }, context);
};

export const drawTagRectangle = (properties, dispatch) => {
  const generateKey = () => {
    const {
      left, top, width, height, color,
    } = properties;
    const { round } = Math;

    return `${round(left)}${round(top)}${round(width)}${round(height)}${color}`;
  };

  // tag
  dispatch([
    ADD_TAG,
    {
      type: DRAW_RECTANGLE,
      ...properties,
      key: generateKey(properties),
      hide: false,
    },
  ]);
};

export const drawInstructions = (ctx, imgData, tagList) => {
  ctx.putImageData(imgData, 0, 0);
  tagList.map((tag) => {
    if (tag.type === DRAW_RECTANGLE && !tag.hide) {
      drawRectangle(tag, ctx);
    }
    return true;
  });
};

export const findTagIndex = (tag, tagList) => tagList.findIndex(
  (list) => (list.key === tag.key),
);

export const removeFromList = (tag, tagList) => {
  tagList.splice(findTagIndex(tag, tagList), 1);
  return [...tagList];
};

export const replaceFromList = (tag, tagList) => {
  tagList.splice(findTagIndex(tag, tagList), 1, tag);
  return [...tagList];
};

export const hideTag = (tag, tagList) => {
  const newTag = tag;
  newTag.hide = true;
  return replaceFromList(newTag, tagList);
};

export const showTag = (tag, tagList) => {
  const newTag = tag;
  newTag.hide = false;
  return replaceFromList(newTag, tagList);
};
