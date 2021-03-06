import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import ChatBox from './ChatBox.js';
import '../css/base.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={ChatBox}/>
  </Router>
), document.getElementById('content'));