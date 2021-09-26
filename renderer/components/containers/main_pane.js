import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../pages/home/home';
import ImageTagger from '../pages/image_tagger/image_tagger';
import { usePageContext } from '../../stores/page_store';

const MainContent = () => {
  const { pages } = usePageContext();

  return (
    <>
      <Route path="/" exact component={() => <Home />} />
      {
        pages.map((page) => (
          <Route
            path={page.key}
            render={() => (
              <>
                <div className="pane">
                  <ImageTagger page={page} />
                </div>
              </>
            )}
          />
        ))
      }
    </>
  );
};

export default MainContent;
