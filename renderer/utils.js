import url from 'url';
import path from 'path';
import JSZip from 'jszip';
import moment from 'moment';
import { saveAs } from 'file-saver';

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

export const exportProject = (pages, labels, workingPath) => {
  const findPagesInWorkingPath = (page) => {
    if (page.src.indexOf(workingPath) !== -1) {
      return true;
    }

    return false;
  };

  const pageHasTags = (page) => {
    if (page.tags && page.tags.length > 0) {
      return true;
    }

    return false;
  };

  const getBase64Image = (imgObject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imgObject.width;
    canvas.height = imgObject.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgObject, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg');
    return dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  };

  const zip = new JSZip();

  // Wrap labels.json
  zip.file('labels.json', JSON.stringify(labels));

  const img = zip.folder('images');

  const outputPages = pages.filter(findPagesInWorkingPath)
    .filter(pageHasTags);

  // Wrap pages.json
  zip.file('pages.json', JSON.stringify(outputPages));

  // Wrap image
  const generateImageZip = (page) => loadImage(page.src)
    .then((imgObject) => getBase64Image(imgObject))
    .then((dataURL) => img.file(page.name, dataURL, { base64: true }))
    .catch((error) => console.log('loading image error', error));

  Promise.all(outputPages.map(generateImageZip))
    .then(() => zip.generateAsync({ type: 'blob' }))
    .then((ctn) => saveAs(ctn, `${moment(new Date()).format('YYYYMMDD_HHmmss')}.zip`));
};
