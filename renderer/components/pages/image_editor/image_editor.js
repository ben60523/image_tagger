import React, { useEffect, useRef, useState } from 'react';
import { loadImage, drawRectangle } from './editor_utils';

export default function imageEditor({ imagePath }) {
  const canvasRef = useRef(null);
  const [canvasStyle, setCanvasStyle] = useState({ width: '100%' });
  const dpi = window.devicePixelRatio;

  const drawImage = (path, canvas, ctx) => loadImage(path)
    .then((img) => {
      if (img.naturalWidth < img.naturalHeight + 25) setCanvasStyle({ height: 'calc(100% - 25px)' });
      else setCanvasStyle({ width: '100%' });
      const width = img.naturalWidth * dpi;
      const height = img.naturalHeight * dpi;
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      ctx.drawImage(img, 0, 0, width, height);
    })
    .catch(() => console.log('loading image error'));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    drawImage(imagePath, canvas, context)
      .then(() => drawRectangle({
        left: 60,
        top: 70,
        width: 400,
        height: 300,
        color: 'red',
      }, context));
  }, [imagePath]);

  return (
    <div
      id="canvas-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}
