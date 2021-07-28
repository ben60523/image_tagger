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

  const outputPages = pages.filter(findPagesInWorkingPath)
    .filter(pageHasTags);

  // Wrap pages.json
  zip.file('pages.json', JSON.stringify(outputPages));

  // Wrap image
  const generateImageZip = (page) => loadImage(page.src)
    .then((imgObject) => getBase64Image(imgObject))
    .then((dataURL) => zip.file(page.name, dataURL, { base64: true }))
    .catch((error) => console.log('loading image error', error));

  Promise.all(outputPages.map(generateImageZip))
    .then(() => zip.generateAsync({ type: 'blob' }))
    .then((ctn) => saveAs(ctn, `${moment(new Date()).format('YYYYMMDD_HHmmss')}.zip`));
};

export const importProject = (e) => {
  const { files } = e.target;

  const classifyFiles = (filesInZip) => {
    let pagesFile = null;
    const imageFileList = [];
    const imageRegExp = /(.jpg|.png|.jpeg)$/;

    Object.keys(filesInZip)
      .forEach((fileName) => {
        if (fileName === 'pages.json') {
          pagesFile = filesInZip[fileName];
          return 'page';
        }

        if (imageRegExp.test(fileName.toLowerCase())) {
          imageFileList.push(filesInZip[fileName]);
          return 'image';
        }

        return null;
      });

    if (pagesFile !== null && imageFileList.length !== 0) {
      return {
        pagesFile,
        imageFileList,
      };
    }

    return null;
  };

  const getPageContents = async (pagesFile) => {
    const pagesString = await pagesFile.async('string');
    return JSON.parse(pagesString);
  };

  const putImageFileAsSrc = (pages, imageFileList) => pages.reduce((accumulator, page) => {
    const correspondImageIndex = imageFileList
      .findIndex((image) => image.name === page.name);

    if (correspondImageIndex !== -1) {
      accumulator.push({
        ...page,
        src: imageFileList[correspondImageIndex],
      });
    }

    return accumulator;
  }, []);

  const getContents = async (zipFile) => {
    try {
      const zip = await JSZip.loadAsync(zipFile);
      const zipCtn = classifyFiles(zip.files);

      if (zipCtn === null) {
        return null;
      }

      const pages = await getPageContents(zipCtn.pagesFile);
      return putImageFileAsSrc(pages, zipCtn.imageFileList);
    } catch (err) {
      console.log(err);
    }

    return null;
  };

  return getContents(files[0]);
};

// load base64 image from File Object
export const getBase64FromFile = async (file) => {
  const base64Data = await file.async('base64');
  const img = new Image();
  img.src = `data:image/jpeg;base64,${base64Data}`;

  return img;
};
