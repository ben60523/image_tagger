import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../components/pages/home/home';
import ImageTagger from '../components/pages/image_tagger/image_tagger';

const MainContent = ({ pages }) => (
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

export default MainContent;
