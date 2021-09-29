import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import { loadImage } from '../../../utils/files_handler';

import { usePageContext } from '../../../stores/page_store';

const usePage = ({ page }) => {
  const { onUpdatePage } = usePageContext();
  const [image, setImage] = useState(null);
  const [focusTag, setFocusTag] = useState(null);
  const [tags, setTag] = useState(page.tags);

  const updatePageTag = () => {
    onUpdatePage({
      ...page,
      tags,
    });
  };

  const removeAllTags = () => {
    setTag([]);
  };

  const removeTag = useCallback(
    (tag) => {
      const tagIndex = tags.findIndex((currentTag) => currentTag.key === tag.key);

      tags.splice(tagIndex, 1);
      setTag([...tags]);
    },
    [tags],
  );

  const initImage = () => {
    loadImage(page.src)
      .then((img) => setImage(img))
      .catch(() => {
        setTimeout(() => {
          initImage();
        }, 500);
      });
  };

  // Initial content
  useEffect(() => {
    initImage();
  }, []);

  useEffect(() => updatePageTag(tags), [tags]);

  return {
    image,
    focusTag,
    tags,
    removeAllTags,
    removeTag,
    setTag,
    setFocusTag,
  };
};

export default usePage;
