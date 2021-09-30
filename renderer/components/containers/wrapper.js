import React from 'react';
import '../../assets/css/photon.css';

import { PageProvider } from '../../stores/page_store';
import { PreferencesProvider } from '../../stores/preferences_store';

import Main from './main_pane';
import Header from './header';
import SideBar from './sidebar';

const App = () => (
  <PreferencesProvider>
    <PageProvider>
      <div className="window">
        <Header />
        <div className="window-content">
          <div className="pane">
            <div className="pane-group">
              <SideBar />
              <Main />
            </div>
          </div>
        </div>
      </div>
    </PageProvider>
  </PreferencesProvider>
);

export default App;
