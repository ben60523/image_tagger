import url from 'url';
import path from 'path';
import { DRAW_RECTANGLE, ADD_TAG } from './constants';

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

// export function drawRectangle(props, ctx) {
//   const {
//     left, top, width, height, color,
//   } = props;

//   const dpr = window.devicePixelRatio;

//   ctx.lineWidth = ctx.canvas.width > ctx.canvas.height
//     ? Math.round(ctx.canvas.width / 500)
//     : Math.round(ctx.canvas.height / 500);

//   ctx.beginPath();
//   ctx.strokeStyle = color;
//   ctx.rect(left * dpr, top * dpr, width * dpr, height * dpr);
//   ctx.stroke();

//   if (props.title) {
//     const fontSize = ctx.lineWidth * 10;
//     const spaceNum = (props.title.split(' ').length - 1);

//     ctx.beginPath();
//     ctx.fillStyle = color;
//     ctx.fillRect(
//       left * dpr,
//       top * dpr - fontSize,
//       ctx.lineWidth * (props.title.length - spaceNum) * 5 + ctx.lineWidth,
//       fontSize,
//     );
//     ctx.stroke();

//     ctx.fillStyle = 'white';
//     ctx.font = `${fontSize}px Arial`;
//     ctx.fillText(props.title, left * dpr + ctx.lineWidth, top * dpr - ctx.lineWidth * 2);
//   }

//   ctx.stroke();
// }

export function drawRectangle(props, ctx) {
  const dpr = window.devicePixelRatio;

  const left = props.left * dpr;
  const top = props.top * dpr;
  const rectangleWidth = props.width * dpr;
  const rectangleHeight = props.height * dpr;

  const ellipseX = left + 0.5 * rectangleWidth;
  const ellipseY = top + 0.5 * rectangleHeight;
  const ellipseWidth = Math.abs(0.5 * rectangleWidth);
  const ellipseHeight = Math.abs(0.5 * rectangleHeight);
  const rotation = 0;
  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.lineWidth = ctx.canvas.width > ctx.canvas.height
    ? Math.round(ctx.canvas.width / 500)
    : Math.round(ctx.canvas.height / 500);

  ctx.strokeStyle = props.color;
  ctx.beginPath();
  ctx.ellipse(ellipseX, ellipseY, ellipseWidth, ellipseHeight, rotation, startAngle, endAngle);
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
  const {
    left,
    top,
    width,
    height,
  } = position;
  const dpr = window.devicePixelRatio;

  drawRectangle({
    left,
    top,
    width,
    height,
    color: 'rgba(179, 179, 179, 1)',
  }, context);

  fillRectangle({
    left: left * dpr,
    top: top * dpr,
    width: width * dpr,
    height: height * dpr,
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

export const drawInstructions = (ctx, imgData, tagList, labels, dpr) => {
  ctx.putImageData(imgData, 0, 0);
  tagList.map((tag) => {
    if (tag.type === DRAW_RECTANGLE && !tag.hide) {
      const foundLabel = labels.find((label) => label.key === tag.label);
      drawRectangle(
        {
          ...tag,
          title: foundLabel.title,
          color: foundLabel.color,
        },
        ctx,
        dpr,
      );
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
