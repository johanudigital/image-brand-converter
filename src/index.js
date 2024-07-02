import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ImageStyleConverter from './ImageStyleConverter';
import './index.css';

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <ImageStyleConverter />
  </Router>,
  document.getElementById('root')
);
