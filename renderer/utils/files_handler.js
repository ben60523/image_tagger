import url from 'url';
import path from 'path';
import JSZip from 'jszip';
import moment from 'moment';
import { saveAs } from 'file-saver';

// load base64 image from File Object
const getBase64FromFile = async (file) => {
  const base64Data = await file.async('base64');
  const img = new Image();
  img.src = `data:image/jpeg;base64,${base64Data}`;

  return img;
};

function loadImageWithPath(src) {
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

const loadImage = (src) => {
  if (typeof src === 'string') {
    return loadImageWithPath(src);
  }

  return getBase64FromFile(src);
};

const exportProject = (pages, labels) => {
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

  const outputPages = pages.filter(pageHasTags);

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

const importProject = (e) => {
  const { files } = e.target;

  const classifyFiles = (filesInZip) => {
    let pagesFile = null;
    let labelsFile = null;
    const imageFileList = [];
    const imageRegExp = /(.jpg|.png|.jpeg)$/;

    Object.keys(filesInZip)
      .forEach((fileName) => {
        if (fileName === 'pages.json') {
          pagesFile = filesInZip[fileName];
          return 'page';
        }

        if (fileName === 'labels.json') {
          labelsFile = filesInZip[fileName];
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
        labelsFile,
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
      .findIndex((image) => {
        const splitedName = image.name.split('/');
        if (splitedName[0] === 'images' && splitedName[1] === page.name) {
          return true;
        }

        return false;
      });

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
      return {
        zipFile,
        pages: putImageFileAsSrc(pages, zipCtn.imageFileList),
        labels: await getPageContents(zipCtn.labelsFile),
      };
    } catch (err) {
      console.log(err);
    }

    return null;
  };

  return getContents(files[0]);
};

export {
  loadImage,
  importProject,
  exportProject,
};
