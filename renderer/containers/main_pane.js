import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../components/pages/home/home';
import ImageTagger from '../components/pages/image_tagger/image_tagger';
import SideBar from './sidebar';

const MainContent = ({ pages }) => (
  <div className="pane">
    <div className="pane-group">
      <Route path="/" exact component={() => <Home />} />
      {
        pages.map((page) => (
          <Route
            path={page.key}
            render={() => (
              <>
                <SideBar pages={pages} />
                <div className="pane">
                  <ImageTagger page={page} />
                </div>
              </>
            )}
          />
        ))
      }
    </div>
  </div>
);

export default MainContent;
