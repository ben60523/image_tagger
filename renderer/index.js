import React from 'react';
import ReactDom from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { HashRouter as Router } from 'react-router-dom';
import Wrapper from './components/containers/wrapper';

ReactDom.render(
  <Router>
    <Wrapper />
  </Router>,
  document.getElementById('root'),
);
